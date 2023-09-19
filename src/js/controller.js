import { async } from 'regenerator-runtime';
import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarkView from './views/bookmarkView';
import addRecipeView from './views/addRecipeView';
import { MODAL_CLOSE_SEC } from './configs';

import 'core.js';
import 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const controlRecipes = async function () {
  try {
    //get the hash from the url
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    //Update results view to mark selected result
    resultsView.update(model.getSearchResultsPage());

    //Update bookmarks view to mark selected bookmark
    bookmarkView.update(model.state.bookmarks);

    //load the recipe
    await model.loadRecipe(id);
    //render the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //get query
    const query = searchView.getQuery();
    if (!query) return;
    //load the search results according to the query
    await model.loadSearchResults(query);

    //render the search results
    resultsView.render(model.getSearchResultsPage());

    //render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  //render new search results
  resultsView.render(model.getSearchResultsPage(goToPage));
  //render pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update the servings (inside state)
  model.updateServings(newServings);
  //render new servings
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);

  //render bookmark
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmark = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlRecipeUpload = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    //Upload Recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    //render the recipe
    recipeView.render(model.state.recipe);
    //render success message
    addRecipeView.renderMessage();
    //close the modal window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

    //render the bookmarks
    bookmarkView.render(model.state.bookmarks);
    //change the url to uploaded recipe
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
  } catch (err) {
    addRecipeView.renderError(err);
  }
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookmark);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);

  addRecipeView.addHandlerUpload(controlRecipeUpload);
};
init();
// getRecipe();
