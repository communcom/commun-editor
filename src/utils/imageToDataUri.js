// @flow

/**
 * Convert an <img> source `url` to a data URI and `callback(err, uri)`.
 */
export default function imageToDataUri(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = window.document.createElement("canvas");

    if (!canvas.getContext) {
      reject(new Error("Canvas is not supported"));
      return;
    }

    const img = window.document.createElement("img");

    img.onload = () => {
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const dataUri = canvas.toDataURL("image/png");

      resolve(dataUri);
    };

    img.ononerror = () => {
      reject(new Error("Failed to load image"));
    };

    img.setAttribute("crossOrigin", "anonymous");
    img.src = url;
  });
}
