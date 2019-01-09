import { Book } from 'app/services/book';
import { updateBooks } from 'app/services/book/actions';
import { LOAD_HOME_REQUEST, loadHomeFailure, loadHomeSuccess } from 'app/services/home/actions';
import { HomeResponse, requestHome, requestHotRelease } from 'app/services/home/requests';
import { updateSelections, updateHotRelease } from 'app/services/selection/actions';
import { SelectionResponse } from 'app/services/selection/requests';
import { all, call, put, take } from 'redux-saga/effects';
import showMessageForRequestError from "app/utils/toastHelper";

export function* watchLoadHome() {
  while (true) {
    yield take(LOAD_HOME_REQUEST);
    try {
      const response: HomeResponse = yield call(requestHome);
      const hotRelease: SelectionResponse = yield call(requestHotRelease);
      // This array might have duplicated book item
      const books = response.collections.reduce((concatedBooks: Book[], section) => {
        return concatedBooks.concat(section.books);
      }, []);
      yield put(updateBooks(books));
      const selections = response.collections.map((section): SelectionResponse => {
        return {
          type: section.type,
          collectionId: section.collectionId,
          title: section.title,
          books: section.books,
          totalCount: 0, // TODO: Ask @minQ
        };
      });
      yield put(updateHotRelease(hotRelease));
      yield put(updateSelections(selections));
      yield put(loadHomeSuccess(response, Date.now()));
    } catch (e) {
      yield put(loadHomeFailure());
      showMessageForRequestError(e);
    }
  }
}

export function* homeRootSaga() {
  yield all([
    watchLoadHome(),
  ]);
}
