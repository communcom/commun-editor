// @flow

import isDataUri from "is-data-uri";
import dataUriToBlob from "./dataUriToBlob";
import imageToDataUri from "./imageToDataUri";

export default async function loadImageFile(url: string): Promise<Blob> {
  if (!isDataUri(url)) {
    url = await imageToDataUri(url);
  }

  return dataUriToBlob(url);
}
