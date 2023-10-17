---
author: henrymbuguakiarie
ms.service: active-directory
ms.topic: include
ms.date: 09/25/2023
ms.author: henrymbugua
---

| Language / framework | Project on<br/>GitHub                                                                                                                | Package                                                               |                                 Getting<br/>started                                  |                     Sign in users                     |                         Access web APIs                         | Generally available (GA) _or_<br/>Public preview<sup>1</sup> |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- | :----------------------------------------------------------------------------------: | :---------------------------------------------------: | :-------------------------------------------------------------: | :----------------------------------------------------------: |
| Angular              | [MSAL Angular v2](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular)<sup>2</sup>          | [msal-angular](https://www.npmjs.com/package/@azure/msal-angular)     |  [Tutorial](../../tutorial-v2-angular-auth-code.md)   | ![Library can request ID tokens for user sign-in.][y] | ![Library can request access tokens for protected web APIs.][y] |                              GA                              |
| Angular              | [MSAL Angular](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/msal-angular-v1/lib/msal-angular)<sup>3</sup> | [msal-angular](https://www.npmjs.com/package/@azure/msal-angular)     |                                          —                                           | ![Library can request ID tokens for user sign-in.][y] | ![Library can request access tokens for protected web APIs.][y] |                              GA                              |
| AngularJS            | [MSAL AngularJS](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-angular)<sup>3</sup> | [msal-angularjs](https://www.npmjs.com/package/@azure/msal-angular) |                                          —                                           | ![Library can request ID tokens for user sign-in.][y] | ![Library can request access tokens for protected web APIs.][y] |                        Public preview                        |
| JavaScript           | [MSAL.js v2](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-browser)<sup>2</sup>               | [msal-browser](https://www.npmjs.com/package/@azure/msal-browser)     | [Tutorial](../../tutorial-v2-javascript-auth-code.md) | ![Library can request ID tokens for user sign-in.][y] | ![Library can request access tokens for protected web APIs.][y] |                              GA                              |
| JavaScript           | [MSAL.js 1.0](/javascript/api/overview/msal-overview)<sup>3</sup>                 | [msal-core](https://www.npmjs.com/package/@azure/msal-core)           |                                          —                                           | ![Library can request ID tokens for user sign-in.][y] | ![Library can request access tokens for protected web APIs.][y] |                              GA                              |
| React                | [MSAL React](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-react)<sup>2</sup>                 | [msal-react](https://www.npmjs.com/package/@azure/msal-react)         |        [Tutorial](../../tutorial-single-page-app-react-register-app.md)         | ![Library can request ID tokens for user sign-in.][y] | ![Library can request access tokens for protected web APIs.][y] |                              GA                              |

<!--
| Vue | [Vue MSAL](https://github.com/mvertopoulos/vue-msal) | [vue-msal](https://www.npmjs.com/package/vue-msal) | ![X indicating no.][n] | ![Green check mark.][y] | ![Green check mark.][y] | -- |
-->

<sup>1</sup> [Universal License Terms for Online Services][preview-tos] apply to libraries in _Public preview_.

<sup>2</sup> [Auth code flow][auth-code-flow] with PKCE only (Recommended).

<sup>3</sup> [Implicit grant flow][implicit-flow] only.

<!--Image references-->

[y]: ../../../develop/media/common/yes.png
[n]: ../../../develop/media/common/no.png

<!--Reference-style links -->

[aad-app-model-v2-overview]: ./v2-overview.md
[microsoft-sdl]: https://www.microsoft.com/securityengineering/sdl/
[preview-tos]: https://www.microsoft.com/licensing/terms/product/ForOnlineServices/all
[auth-code-flow]: ../../v2-oauth2-auth-code-flow.md
[implicit-flow]: ../../v2-oauth2-implicit-grant-flow.md
