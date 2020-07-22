---
title: How to troubleshoot the Azure Data Lake Analytics U-SQL job failures because of .NET Framework 4.7.2 upgrade
description: 'Troubleshoot U-SQL job failures because of the upgrade to .NET Framework 4.7.2.'
services: data-lake-analytics
author: guyhay
ms.author: guyhay
ms.reviewer: jasonwhowell
ms.service: data-lake-analytics
ms.topic: troubleshooting
ms.workload: big-data
ms.date: 10/11/2019
---

# Azure Data Lake Analytics is upgrading to the .NET Framework v4.7.2

The Azure Data Lake Analytics default runtime is upgrading from .NET Framework v4.5.2 to .NET Framework v4.7.2. This change introduces a small risk of breaking changes if your U-SQL code uses custom assemblies, and those custom assemblies use .NET libraries.

This upgrade from .NET Framework 4.5.2 to version 4.7.2 means that the .NET Framework deployed in a U-SQL runtime (the default runtime) will now always be 4.7.2. There isn't a side-by-side option for .NET Framework versions.

After this upgrade to .NET Framework 4.7.2 is complete, the system’s managed code will run as version 4.7.2, user provided libraries such as the U-SQL custom assemblies will run in the backwards-compatible mode appropriate for the version that the assembly has been generated for.

- If your assembly DLLs are generated for version 4.5.2, the deployed framework will treat them as 4.5.2 libraries, providing (with a few exceptions) 4.5.2 semantics.
- You can now use U-SQL custom assemblies that make use of version 4.7.2 features, if you target the .NET Framework 4.7.2.

Because of this upgrade to .NET Framework 4.7.2, there's a potential to introduce breaking changes to your U-SQL jobs that use .NET custom assemblies. We suggest you check for backwards-compatibility issues using the procedure below.

## How to check for backwards-compatibility issues

Check for the potential of backwards-compatibility breaking issues by running the .NET compatibility checks on your .NET code in your U-SQL custom assemblies.

> [!Note]
> The tool doesn't detect actual breaking changes. it only identifies called .NET APIs that may (for certain inputs) cause issues. If you get notified of an issue, your code may still be fine, however you should check in more details.

1. Run the backwards-compatibility checker on your .NET DLLs either by
   1. Using the Visual Studio Extension at [.NET Portability Analyzer Visual Studio Extension](https://marketplace.visualstudio.com/items?itemName=ConnieYau.NETPortabilityAnalyzer)
   1. Downloading and using the standalone tool from [GitHub dotnetapiport](https://github.com/microsoft/dotnet-apiport). Instructions for running standalone tool are at [GitHub dotnetapiport breaking changes](https://github.com/microsoft/dotnet-apiport/blob/dev/docs/HowTo/BreakingChanges.md)
   1. For 4.7.2. compatibility, `read isRetargeting == True` identifies possible issues.
2. If the tool indicates if your code may be impacted by any of the possible backwards-incompatibilities (some common examples of incompatibilities are listed below),  you can further check by
   1. Analyzing your code and identifying if your code is passing values to the impacted APIs
   1. Perform a runtime check. The runtime deployment isn't done side-by-side in ADLA. You can perform a runtime check before the upgrade, using VisualStudio’s local run with a local .NET Framework 4.7.2 against a representative data set.
3. If you indeed are impacted by a backwards-incompatibility, take the necessary steps to fix it (such as fixing your data or code logic).

In most cases, you should not be impacted by backwards-incompatibility.

## Timeline

You can check for the deployment of the new runtime here [Runtime troubleshoot](runtime-troubleshoot.md), and by looking at any prior successful job.

### What if I can't get my code reviewed in time

You can submit your job against the old runtime version (which is built targeting 4.5.2), however due to the lack of .NET Framework side-by-side capabilities, it will still only run in 4.5.2 compatibility mode. You may still encounter some of the backwards-compatibility issues because of this behavior.

### What are the most common backwards-compatibility issues you may encounter

The most common backwards-incompatibilities that the checker is likely to identify are (we generated this list by running the checker on our own internal ADLA jobs), which libraries are impacted (note: that you may call the libraries only indirectly, thus it is important to take required action #1 to check if your jobs are impacted), and possible actions to remedy. Note: In almost all cases for our own jobs, the warnings turned out to be false positives due to the narrow natures of most breaking changes.

- IAsyncResult.CompletedSynchronously property must be correct for the resulting task to complete
  - When calling TaskFactory.FromAsync, the implementation of the IAsyncResult.CompletedSynchronously property must be correct for the resulting task to complete. That is, the property must return true if, and only if, the implementation completed synchronously. Previously, the property was not checked.
  - Impacted Libraries: mscorlib, System.Threading.Tasks
  - Suggested Action: Ensure TaskFactory.FromAsync returns true correctly

- DataObject.GetData now retrieves data as UTF-8
  - For apps that target the .NET Framework 4 or that run on the .NET Framework 4.5.1 or earlier versions, DataObject.GetData retrieves HTML-formatted data as an ASCII string. As a result, non-ASCII characters (characters whose ASCII codes are greater than 0x7F) are represented by two random characters.#N##N#For apps that target the .NET Framework 4.5 or later and run on the .NET Framework 4.5.2, `DataObject.GetData` retrieves HTML-formatted data as UTF-8, which represents characters greater than 0x7F correctly.
  - Impacted Libraries: Glo
  - Suggested Action: Ensure data retrieved is the format you want

- XmlWriter throws on invalid surrogate pairs
  - For apps that target the .NET Framework 4.5.2 or previous versions, writing an invalid surrogate pair using exception fallback handling does not always throw an exception. For apps that target the .NET Framework 4.6, attempting to write an invalid surrogate pair throws an `ArgumentException`.
  - Impacted Libraries: System.Xml, System.Xml.ReaderWriter
  - Suggested Action: Ensure you are not writing an invalid surrogate pair that will cause argument exception

- HtmlTextWriter does not render `<br/>` element correctly
  - Beginning in the .NET Framework 4.6, calling `HtmlTextWriter.RenderBeginTag()` and `HtmlTextWriter.RenderEndTag()` with a `<BR />` element will correctly insert only one `<BR />` (instead of two)
  - Impacted Libraries: System.Web
  - Suggested Action: Ensure you are inserting the amount of `<BR />` you expect to see so no random behavior is seen in production job

- Calling CreateDefaultAuthorizationContext with a null argument has changed
  - The implementation of the AuthorizationContext returned by a call to the `CreateDefaultAuthorizationContext(IList<IAuthorizationPolicy>)` with a null authorizationPolicies argument has changed its implementation in the .NET Framework 4.6.
  - Impacted Libraries: System.IdentityModel
  - Suggested Action: Ensure you are handling the new expected behavior when there is null authorization policy
  
- RSACng now correctly loads RSA keys of non-standard key size
  - In .NET Framework versions prior to 4.6.2, customers with non-standard key sizes for RSA certificates are unable to access those keys via the `GetRSAPublicKey()` and `GetRSAPrivateKey()` extension methods. A `CryptographicException` with the message "The requested key size is not supported" is thrown. With the .NET Framework 4.6.2 this issue has been fixed. Similarly, `RSA.ImportParameters()` and `RSACng.ImportParameters()` now work with non-standard key sizes without throwing `CryptographicException`'s.
  - Impacted Libraries: mscorlib, System.Core
  - Suggested Action: Ensure RSA keys are working as expected

- Path colon checks are stricter
  - In .NET Framework 4.6.2, a number of changes were made to support previously unsupported paths (both in length and format). Checks for proper drive separator (colon) syntax were made more correct, which had the side effect of blocking some URI paths in a few select Path APIs where they used to be tolerated.
  - Impacted Libraries: mscorlib, System.Runtime.Extensions
  - Suggested Action:

- Calls to ClaimsIdentity constructors
  - Starting with the .NET Framework 4.6.2, there is a change in how `T:System.Security.Claims.ClaimsIdentity` constructors with an `T:System.Security.Principal.IIdentity` parameter set the `P:System.Security.Claims.ClaimsIdentify.Actor` property. If the `T:System.Security.Principal.IIdentity` argument is a `T:System.Security.Claims.ClaimsIdentity` object, and the `P:System.Security.Claims.ClaimsIdentify.Actor` property of that `T:System.Security.Claims.ClaimsIdentity` object is not `null`, the `P:System.Security.Claims.ClaimsIdentify.Actor` property is attached by using the `M:System.Security.Claims.ClaimsIdentity.Clone` method. In the Framework 4.6.1 and earlier versions, the `P:System.Security.Claims.ClaimsIdentify.Actor` property is attached as an existing reference. Because of this change, starting with the .NET Framework 4.6.2, the `P:System.Security.Claims.ClaimsIdentify.Actor` property of the new `T:System.Security.Claims.ClaimsIdentity` object is not equal to the `P:System.Security.Claims.ClaimsIdentify.Actor` property of the constructor's `T:System.Security.Principal.IIdentity` argument. In the .NET Framework 4.6.1 and earlier versions, it is equal.
  - Impacted Libraries: mscorlib
  - Suggested Action: Ensure ClaimsIdentity is working as expected on new runtime

- Serialization of control characters with DataContractJsonSerializer is now compatible with ECMAScript V6 and V8
  - In the .NET framework 4.6.2 and earlier versions, the DataContractJsonSerializer did not serialize some special control characters, such as \b, \f, and \t, in a way that was compatible with the ECMAScript V6 and V8 standards. Starting with the .NET Framework 4.7, serialization of these control characters is compatible with ECMAScript V6 and V8.
  - Impacted Libraries: System.Runtime.Serialization.Json
  - Suggested Action: Ensure same behavior with DataContractJsonSerializer
