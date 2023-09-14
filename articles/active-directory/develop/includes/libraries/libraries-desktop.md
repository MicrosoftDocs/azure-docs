| Language / framework | Project on<br/>GitHub                                                                                     | Package                                                                               | Getting<br/>started                        | Sign in users                                         | Access web APIs                                                 | Generally available (GA) *or*<br/>Public preview<sup>1</sup> |
|----------------------|-----------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------|:------------------------------------------:|:-----------------------------------------------------:|:---------------------------------------------------------------:|:------------------------------------------------------------:|
| Electron             | [MSAL Node.js](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) | [msal-node](https://www.npmjs.com/package/@azure/msal-node)                    | —                                          | ![Library can request ID tokens for user sign-in.][y] | ![Library can request access tokens for protected web APIs.][y] | Public preview                                               |
| Java                 | [MSAL4J](https://github.com/AzureAD/microsoft-authentication-library-for-java)                            | [msal4j](https://mvnrepository.com/artifact/com.microsoft.azure/msal4j)               | —                                          | ![Library can request ID tokens for user sign-in.][y] | ![Library can request access tokens for protected web APIs.][y] | GA                                                           |
| macOS (Swift/Obj-C)  | [MSAL for iOS and macOS](https://github.com/AzureAD/microsoft-authentication-library-for-objc)            | [MSAL](https://cocoapods.org/pods/MSAL)                                               | [Tutorial](../../tutorial-v2-ios.md)             | ![Library can request ID tokens for user sign-in.][y] | ![Library can request access tokens for protected web APIs.][y] | GA                                                           |
| UWP                  | [MSAL.NET](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet)                        | [Microsoft.Identity.Client](https://www.nuget.org/packages/Microsoft.Identity.Client) | [Tutorial](../../tutorial-v2-windows-uwp.md)     | ![Library can request ID tokens for user sign-in.][y] | ![Library can request access tokens for protected web APIs.][y] | GA                                                           |
| WPF                  | [MSAL.NET](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet)                        | [Microsoft.Identity.Client](https://www.nuget.org/packages/Microsoft.Identity.Client) | [Tutorial](../../tutorial-v2-windows-desktop.md) | ![Library can request ID tokens for user sign-in.][y] | ![Library can request access tokens for protected web APIs.][y] | GA                                                           |
<!--
| Java | Scribe | [Scribe Java](https://mvnrepository.com/artifact/org.scribe/scribe) | ![X indicating no.][n] | ![Green check mark.][y] | ![Green check mark.][y] | -- |
| React Native | [React Native App Auth](https://github.com/FormidableLabs/react-native-app-auth/blob/main/docs/config-examples/azure-active-directory.md) | [react-native-app-auth](https://www.npmjs.com/package/react-native-app-auth) | ![X indicating no.][n] | ![Green check mark.][y] | ![Green check mark.][y] | -- |
-->

<sup>1</sup> [Universal License Terms for Online Services][preview-tos] apply to libraries in *Public preview*.

<!--Image references-->

[y]: ../../../develop/media/common/yes.png
[n]: ../../../develop/media/common/no.png


<!--Reference-style links -->

[preview-tos]: https://www.microsoft.com/licensing/terms/product/ForOnlineServices/all