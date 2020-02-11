import {
  ADD_PROTECTED_NODE,
  ADD_TOP_K_QUERY,
  APPEND_DETAIL_LIST,
  DATA_LOADED,
  DELETE_PROTECTED_NODE,
  SNACKBAR_CLOSE,
  SNACKBAR_OPEN,
  TOGGLE_GRAPH_MENU_BUTTON,
  ToGGle_SHOW_NEGATIVE,
  TOGGLE_SHOW_POSITIVE,
  UPDATE_ACTIVATED_TAB_INDEX,
  UPDATE_ALGORITHM_NAME,
  UPDATE_CONSTRAINTS,
  UPDATE_DATA_NAME,
  UPDATE_K, UPDATE_LEVEL_BOUND,
  UPDATE_PROTECTION_EXTENT,
  UPDATE_PROTECTION_TYPE
} from "../constants/actionTypes";
import axios from "axios";
import store from "../store";
import * as d3 from "d3";

export function updateDataName(payload) {
  return { type: UPDATE_DATA_NAME, payload };
}

export function updateAlgorithmName(payload) {
  return { type: UPDATE_ALGORITHM_NAME, payload };
}

export function deleteProtectedNode(payload) {
  return { type: DELETE_PROTECTED_NODE, payload };
}

export function addProtectedNode(payload) {
  return { type: ADD_PROTECTED_NODE, payload };
}

export function updateProtectionType(payload) {
  return { type: UPDATE_PROTECTION_TYPE, payload };
}

export function updateProtectionExtent(payload) {
  return { type: UPDATE_PROTECTION_EXTENT, payload };
}

export function snackBarClose() {
  return { type: SNACKBAR_CLOSE };
}

export function updateActivatedTabIndex(payload) {
  return { type: UPDATE_ACTIVATED_TAB_INDEX, payload };
}

export function appendDetailList(payload) {
  return { type: APPEND_DETAIL_LIST, payload };
}

export function updateK(payload) {
  return { type: UPDATE_K, payload };
}

export function addTopKQuery(removedID) {
  const state = store.getState();
  let newTopKQueryList = [...state.detailList[removedID]["topKQueryList"]];
  newTopKQueryList.push(state.currentK);
  let detail = {};
  detail[removedID] = Object.assign({}, state.detailList[removedID], {
    topKQueryList: newTopKQueryList
  });
  console.log(detail);
  let newDetailList = Object.assign({}, state.detailList, detail);
  console.log(newDetailList);
  return { type: ADD_TOP_K_QUERY, payload: newDetailList };
}

export function toggleGraphMenu(removedID, target) {
  const state = store.getState();
  let detail = {};
  detail[removedID] = Object.assign({}, state.detailList[removedID], {
    graphMenuOpen: target
  });
  console.log(detail);
  let newDetailList = Object.assign({}, state.detailList, detail);
  console.log(newDetailList);
  return { type: TOGGLE_GRAPH_MENU_BUTTON, payload: newDetailList };
}

export function toggleGraphDisplayPNOption(removedID, direction) {
  const state = store.getState();
  let detail = {};
  const svgIDBase = "#impact-graph-chart-base-" + removedID;
  if (direction === "positive") {
    if (state.detailList[removedID]["showPositive"]) {
      d3.select(svgIDBase)
        .selectAll(".positive")
        .attr("display", "none");
    } else {
      d3.select(svgIDBase)
        .selectAll(".positive")
        .attr("display", "block");
    }
    detail[removedID] = Object.assign({}, state.detailList[removedID], {
      showPositive: !state.detailList[removedID]["showPositive"]
    });
  } else {
    console.log("now to to remove negative!");
    if (state.detailList[removedID]["showNegative"]) {
      d3.select(svgIDBase)
        .selectAll(".negative")
        .attr("display", "none");
    } else {
      d3.select(svgIDBase)
        .selectAll(".negative")
        .attr("display", "block");
    }

    detail[removedID] = Object.assign({}, state.detailList[removedID], {
      showNegative: !state.detailList[removedID]["showNegative"]
    });
  }

  console.log(detail);
  let newDetailList = Object.assign({}, state.detailList, detail);
  console.log(newDetailList);
  if (direction === "positive") {
    return { type: TOGGLE_SHOW_POSITIVE, payload: newDetailList };
  } else {
    return { type: ToGGle_SHOW_NEGATIVE, payload: newDetailList };
  }
}

export function updateLevelBound(removedID, value) {
  const state = store.getState();
  let detail = {};
  detail[removedID] = Object.assign({}, state.detailList[removedID], {
    levelLowerBound: value[0],
    levelUpperBound: value[1]
  });
  let newDetailList = Object.assign({}, state.detailList, detail);
  return { type: UPDATE_LEVEL_BOUND, payload: newDetailList };
}

export function updateConstraints() {
  const protectionType = store.getState().protectionType;
  const protectionExtent = store.getState().protectionExtent;
  const perturbations = store.getState().perturbations;
  const protectedNodes = store.getState().protectedNodes;
  const vulnerabilityList = store.getState().vulnerabilityList;
  let bannedNodes = [];
  const threshold = perturbations.length * protectionExtent;
  console.log(threshold);
  Array.from(protectedNodes).map(nodeID => {
    let temp = [];
    if (protectionType === "increased") {
      temp = vulnerabilityList[nodeID].filter(
        item => item["rank_change"] > threshold
      );
    } else if (protectionType === "decreased") {
      temp = vulnerabilityList[nodeID].filter(
        item => item["rank_change"] < -threshold
      );
    }
    bannedNodes = bannedNodes.concat(temp);
  });
  console.log("banned nodes");
  console.log(bannedNodes);
  console.log("previous length: " + perturbations.length);
  const bannedNodesSet = new Set(bannedNodes.map(node => node["node_id"]));
  const filteredPerturbations = perturbations.filter(
    item => !bannedNodesSet.has(item["remove_id"])
  );
  console.log("after length:" + filteredPerturbations.length);
  return {
    type: UPDATE_CONSTRAINTS,
    payload: {
      filteredPerturbations: filteredPerturbations,
      snackbarOpen: true,
      snackbarMessage: "Pulled " + filteredPerturbations.length + " records."
    }
  };
}

export function getData() {
  return function(dispatch, getState) {
    axios
      .post("/loadData/", {
        dataName: getState().dataName,
        algorithmName: getState().algorithmName
      })
      .then(response => {
        const parsedData = JSON.parse(JSON.stringify(response.data));
        dispatch({ type: DATA_LOADED, payload: parsedData });
      });
  };
}
