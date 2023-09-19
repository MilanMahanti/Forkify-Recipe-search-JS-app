import icons from 'url:../../img/icons.svg';
import View from './View';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');
  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
  _generateMarkup() {
    const currPage = this._data.page;
    const numOfPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    console.log(numOfPages);
    //page 1 with other pages
    if (currPage === 1 && numOfPages > 1) {
      return this.generateMarkupNextBtn(currPage);
    }
    //page 1 with no other pages
    //last page
    if (currPage === numOfPages && numOfPages > 1) {
      return this.generateMarkupPrevBtn(currPage);
    }
    //other page
    if (currPage < numOfPages) {
      return (
        this.generateMarkupNextBtn(currPage) +
        this.generateMarkupPrevBtn(currPage)
      );
    }
  }

  generateMarkupPrevBtn(currPage) {
    return `
    <button data-goto='${
      currPage - 1
    }' class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${currPage - 1}</span>
    </button>`;
  }
  generateMarkupNextBtn(currPage) {
    return `
    <button data-goto='${
      currPage + 1
    }' class="btn--inline pagination__btn--next">
      <span>Page ${currPage + 1}</span>
      <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button> `;
  }
}

export default new PaginationView();
