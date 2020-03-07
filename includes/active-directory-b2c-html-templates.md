---
author: msmimart
ms.service: active-directory-b2c
ms.subservice: B2C
ms.topic: include
ms.date: 02/12/2020
ms.author: mimart
---
## Sample templates
You can find sample templates for UI customization here:

```bash
git clone https://github.com/Azure-Samples/Azure-AD-B2C-page-templates
```

This project contains the following templates:
- [Ocean Blue](https://github.com/Azure-Samples/Azure-AD-B2C-page-templates/tree/master/ocean_blue)
- [Slate Gray](https://github.com/Azure-Samples/Azure-AD-B2C-page-templates/tree/master/slate_gray)

To use the sample:

1. Clone the repo on your local machine. Choose a template folder `/ocean_blue` or `/slate_gray`.
1. Upload all the files under the template folder and the `/assets` folder, to Blob storage as described in the previous sections.
1. Next, open each `\*.html` file in the root of either `/ocean_blue` or `/slate_gray`, replace all instances of relative URLs with the URLs of the css, images, and fonts files you uploaded in step 2. For example:
    ```html
    <link href="./css/assets.css" rel="stylesheet" type="text/css" />
    ```

    To
    ```html
    <link href="https://your-storage-account.blob.core.windows.net/your-container/css/assets.css" rel="stylesheet" type="text/css" />
    ```
1. Save the `\*.html` files and upload them to Blob storage.
1. Now modify the policy, pointing to your HTML file, as mentioned previously.
1. If you see missing fonts, images, or CSS, check your references in the extensions policy and the \*.html files.
