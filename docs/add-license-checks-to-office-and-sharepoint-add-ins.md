---
title: Add license checks to Office and SharePoint Add-ins
description: Test the license-checking code of your add-in by using test licenses.
ms.date: 11/27/2017 
---

# Add license checks to Office and SharePoint Add-ins

You can create and load test your Office Add-in licenses. To help you test your add-in's license-checking code, you can use test licenses. The Office runtime treats these test tokens as if they were valid tokens acquired from the Office Store, with the exception that tokens loaded through the registry are not tested for expiration or entitlement type. These test licenses are strings that conform to the [add-in license schema structure](add-in-license-schema.md).
 
To create a test token: 

- Copy the example [license schema](add-in-license-schema.md) into a text file and save it with a .tok extension.
- Change the appropriate attributes, such as Product ID.
- Make sure the test attribute is present and set equal to **true**.
    
The Office Store verification web service, which you use to verify add-in license tokens, does not validate the encryption token or any of the attribute values of license tokens where the test attribute is set to **true**. You can edit your test tokens directly and use them to test add-in behavior code based on different attribute values.
 
For Word, Excel, and PowerPoint add-ins: 

- Create your test tokens.
- Upload your test license tokens by using the developer registry. For details, see [Load a test license](#load-a-test-license) later in this article.
    
For Outlook add-ins:

- Create your test token.
- Create a URL-encoded version of the add-in license token.
- In the add-in manifest file, manually edit the appropriate [SourceLocation](http://dev.office.com/reference/add-ins/manifest/sourcelocation) element. Add the URL-encoded version of the license token to the source location URL as a query parameter named *et*  .
    
    > [!NOTE]
    > If your add-in uses [getUserIdentityTokenAsync](http://dev.office.com/reference/add-ins/outlook/Office.context.mailbox), adding to the [SourceLocation](http://dev.office.com/reference/add-ins/manifest/sourcelocation) element in the manifest changes the URL in the token because the token generation is based on what is in the manifest. When you test the license token, you have to modify the validation call on your service so that the validation accepts the modified URL. For example, if you use the [managed API token validation](https://dev.office.com/docs/add-ins/outlook/use-the-token-validation-library) library, you need to change the _hostUri_ parameter to match the modified [SourceLocation](http://dev.office.com/reference/add-ins/manifest/sourcelocation). Remember to change the Exchange identity token validation callback after you test the license check.

<a name="bk_implement"> </a>
## Implement license checks in the Office Add-in code

Think about where in your add-in you want to check for a valid license or other license information; for example, when the add-in launches, or when the user goes to a specific page or accesses certain features.

Before you can check the license, you'll have to acquire and cache the add-in license token. When a user opens an Office Add-in, the Office application requests the add-in home page. The Office application makes the HTTP request for the home page, including the license token as a query string parameter on the page's URL.

For example, suppose your add-in home page has the following URL:

   `http://myApp/index.html`

The Office application calling that URL would add the following query string to it and then pass the URL:

![The following URL: http://myApp/index.htm?et= PAByAD4APAB0ACAAYQBpAGQAPQAiAFcAQQAxADAAMgA4ADkAOQA1ADYANgAiACAAcABpAGQAPQAiADMAZAAyADgANwAwADcAYQAtAGYAYwBjAGUALQA0ADUAMQA3AC0AYQBjADYAZQAtAGMAYQAwAGEAZABkADYAMwA3ADMAYQBhACIAIABjAGkAZAA9ACIAMgAzAEEANwBFAEIAOABBADQAQwA0ADcARgA1AEEAMgAiACAAdABzAD0AIgAwACIAIABzAGwAPQAiAHQAcgB1AGUAIgAgAGUAdAA9ACIARgByAGUAZQAiACAAYQBkAD0AIgAyADAAMQAyAC0AMAA1AC0AMgAyAFQAMQA4ADoAMQAyADoAMgAzAFoAIgAgAHMAZAA9ACIAMgAwADEAMgAtADAANQAtADIAMgAiACAAdABlAD0AIgAyADAANgA3AC0AMAAyAC0AMgAzAFQAMQA4ADoAMQA0ADoAMAAwAFoAIgAgAC8APgA8AGQAPgAyADIAWABLAEEAdgA0ADMAQgBtAHMAcwByADAAcgBxADUANQBGAHUAdgBpAFUAVgBSAGkAVgBLAFMASQBEAGcAeAAyAHAAMgA0AFoAZwBzAGwANgBNAD0APAAvAGQAPgA8AC8AcgA%2bAA%3d%3d](images/query-string-url.png)
 
The query string parameter _et_ specifies a base-64 and URL-encoded version of the add-in license token.

For Outlook add-ins, the *et* query parameter string is only URL-encoded, and **not** base-64 encoded.

For example, the source location modified to include a test token for an Outlook add-in would look like this: 

  `https://myApp/index.htm?et=%3Cr%20v%3D%221%22%3E%3Ct%20aid%3D%22WA104108294%22%20pid%3D%22463eafac-c123-45fe-bd21-b1b120b4c12b%22%20cid%3D%223BEC2F1C0124D801%22%20did%3D%22CONTOSO.COM%22%20ts%3D%221%22%20et%3D%22Paid%22%20ad%3D%222013-08-29T21%3A38%3A14Z%22%20sd%3D%222013-09-17%22%20te%3D%222013-12-23T09%3A10%3A42Z%22%20test%3D%221%22%20ss%3D%220%22%20%2F%3E%3Cd%3E7uM9j2%2FYZJeZrrm2TLjXufQlwkAXkq2RqjowBP9fAjo%3D%3C%2Fd%3E%3C%2Fr%3E`

> [!IMPORTANT]
> For security reasons, if you are licensing your Office Add-in, we strongly recommended that you specify an HTTP Secure ( `https://`) URL for your add-in home page.

To perform add-in license checks, include code that extracts the license token from the URL and caches it, so that the add-in can pass the token to the verification service later when you want to actually validate the license.

For example, the following code extracts the token from the URL, decodes the token, and formats it as a string:

```csharp
// Obtains token URL
string token = Request.Params["et"].ToString(); 

// Applies base64 decoding of the token to get a decoded token.
byte[] decodedBytes = Convert.FromBase64String(token); 
string decodedToken = Encoding.Unicode.GetString(decodedBytes);
```

> [!NOTE]
> The decoding will throw an error if the token contains white space. Make sure that you handle white space between characters within the token.

To help maximize the reach and adoption, task pane and content add-ins allow anonymous access. Microsoft does not require that a user be signed in to Office with their Microsoft account to activate task pane and content add-ins. The license token is passed as part of the initial HTTP request only if the user is signed in with their Microsoft account.

For task pane and content add-ins, your code should first test for the presence of the *et* parameter in the HTTP request. If it is not present, you should treat the user as anonymous, and present the appropriate user experience.

For more information, see [add-in license tokens and anonymous access for Office Add-ins](license-your-add-ins.md#bk_anonymous).

> [!IMPORTANT]
> Do not to parse or otherwise manipulate the add-in license token string before passing it to the Office Store verification web service for verification. While the add-in license token is structured as an XML fragment, for purposes of validation, the Office Store verification web service treats the token as a literal string. The Office Store verification web service compares the contents of the `<t>` element to the value of the `<d>` element, which is an encrypted signature derived from the literal string contained in the `<t>` element. Any reformatting of the license token, such as adding white space, tabs, or line breaks, changes the literal value of the `<t>` element and therefore causes the license verification check to fail. 

> Also, do not store the license token using a service or application that adds a byte order mark (BOM) to the license token string. Including this character in the license token passed to the verification service causes the license check to fail. If you do use an application that adds a BOM to the token, you must remove this character before passing the license token to the verification service.

When the add-in needs to perform a license check, pass the license token to the Office Store license verification web service for validation. The verification service is located at the following URL:

 `https://verificationservice.officeapps.live.com/ova/verificationagent.svc`

The verification service has a single method [VerifyEntitlementToken](https://msdn.microsoft.com/en-us/library/office/verificationsvc.verificationserviceclient.verifyentitlementtoken.aspx) that takes the license token as a parameter and returns a [VerifyEntitlementTokenResponse](https://msdn.microsoft.com/en-us/library/office/verificationsvc.verifyentitlementtokenresponse.aspx) object that contains the properties of the license. The [IsValid](https://msdn.microsoft.com/en-us/library/office/verificationsvc.verifyentitlementtokenresponse.isvalid.aspx) property specifies whether the license token is valid. Other properties, such as [ProductId](https://msdn.microsoft.com/en-us/library/office/verificationsvc.verifyentitlementtokenresponse.productid.aspx) and [EntitlementType](https://msdn.microsoft.com/en-us/library/office/verificationsvc.verifyentitlementtokenresponse.entitlementtype.aspx), contain information about the various license attributes.

The Office Store license verification web service also supports verifying add-in license tokens by using REST calls. To validate an add-in license by using REST, use the following syntax, where `{token}` is the add-in license token, encoded by a method that complies with RFC 2396; for example, the **encodeURIComponent()** function in JavaScript, or the **Uri.EscapeDataString** method in the .NET Framework:

 `https://verificationservice.officeapps.live.com/ova/verificationagent.svc/rest/verify?token={token}`

Calling the Office Store verification service from client-side code is not supported. You must use server-side code to query the Office Store verification web service.

<a name="bk_take"> </a>
## Add code for the action the Office Add-in takes, based on its license

Add code to your add-in that takes the appropriate action, based on whether the license is valid and, if it is valid, based on any other license information that is important to you; for example, code that enables the user to access certain features if the user's license is for the paid version, but not the trial version.

<a name="bk_add"> </a>
## Add code to block the Office Add-in from accepting test licenses

After you finish testing your add-in and you're ready to move it to production, add code to the license checks in your add-in so that it no longer accepts test licenses. This prevents users from using test licenses to access your add-in.

After you pass the add-in license token to the verification service's [VerifyEntitlementToken](https://msdn.microsoft.com/en-us/library/office/verificationsvc.verificationserviceclient.verifyentitlementtoken.aspx) method, use the [VerifyEntitlementTokenResponse](https://msdn.microsoft.com/en-us/library/office/verificationsvc.verifyentitlementtokenresponse.aspx) object returned by that method to access the license properties. 

For test licenses, the [IsTest](https://msdn.microsoft.com/en-us/library/office/verificationsvc.verifyentitlementtokenresponse.istest.aspx) property returns **true** and the [IsValid](https://msdn.microsoft.com/en-us/library/office/verificationsvc.verifyentitlementtokenresponse.isvalid.aspx) property returns **false**.

> [!NOTE]
> For Outlook add-ins, make sure that you remove the *et* parameter, which represents the test license token, from all **SourceLocation** elements in your add-in manifest file.

## Code example: Check the Office Add-in license by retrieving and validating its add-in license token

The following example shows the basic logic flow of retrieving and validating the license token for a content or task pane add-in: 

1. The code retrieves the URL query string parameter, `et`, which contains the encoded license token. 

2. The code uses a custom function to decode the license token and convert it from base-64 to a string format that the Office Store verification service accepts.
    
    > [!NOTE]
    > For Outlook add-ins, the *et* query parameter string is only URL-encoded, and **not** base-64 encoded. To use this example with an Outlook add-in, remove the code that converts the token from base-64 encoding.

3. The code passes the token in string format to the verification service for validation. After the verification service returns a **VerifyEntitlementTokenResponse** object that represents the validation results, the code can access the object's properties that contain attributes of the license token.
 
In this example, the code prints out the user ID of the add-in user and whether the license token is a test token.

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Collections.Specialized;
using System.Text;
using EtokenWeb.OmexTokenService;

namespace EtokenWeb{

    public partial class EToken : System.Web.UI.Page{
        public string etoken = "";
        private static VerificationServiceClient service = new VerificationServiceClient();

        protected void Page_Load(object sender, EventArgs e){
           
            etoken = Request.QueryString["et"];
            if (etoken != null)
            {
                Response.Write("my value:" + etoken + "<br>");
                CallVerificationService(etoken);
            }
            else
                Response.Write("no token provided<br>?");
        }

        private void CallVerificationService(string etoken){
            VerifyEntitlementTokenRequest request = new VerifyEntitlementTokenRequest();
            request.EntitlementToken =  DecodeToken(etoken);
            VerifyEntitlementTokenResponse  omexResponse = service.VerifyEntitlementToken(request);
            Response.Write("Is Test:" + omexResponse.IsTest + "<br>") ;
            Response.Write("User ID: "+ omexResponse.UserId + "<br>") ;
        }

        private static string DecodeToken(string encodedToken){
            byte[] decodedBytes = Convert.FromBase64String(encodedToken);
            return Encoding.Unicode.GetString(decodedBytes);
        }
    }
}

```

<a name="load-a-test-license"> </a>
## Inject an add-in license into an Office Add-in at runtime

The Office and SharePoint Add-ins licensing model gives you a way to include code in your add-in to verify and enforce how it's used based on the properties of its license. You can load a test license with your add-in from either: 

- The Visual Studio project for your add-in.
- The file system by using the Developer Registry provider.

Both methods allow an add-in to get the license the same way it would if it were launched from the Office Store or a SharePoint add-in catalog. However, test licenses aren't treated the same way by the Office and SharePoint Add-ins runtime. They are not tested for expiration or the entitlement type, and therefore won't trigger a token refresh or raise an error in the UI.

### To load a test license from your Visual Studio project

1. Create or open a content or task pane add-in project in Visual Studio.

2. In **Solution Explorer**, right-click the Office project (the first of the two projects in the solution, not the second Web project), and select **Open Folder in File Explorer**.

3. Go to `...bin\Debug\OfficeAppManifests` (substitute "Debug" with "Release" if your project is configured for Release builds). This folder is created automatically after the first time you build or debug your project.

4. Add a token file to the folder. The token file name must be the same as the manifest file name and have a .tok file extension. The following code shows an example of a token file. Refer to the [Office and SharePoint Add-in license XML schema structure](add-in-license-schema.md) for details about the attribute values you can set in the `<t>` element of the token file.
    
   In this example, the user is signed in with a Microsoft account. The `cid` value is set for Microsoft account users.
    
    ```XML
    <r>
      <t 
        aid="WA900006056"
        pid="{4FB601F2-5469-4542-B9FC-B96345DC8B39}"
        cid="32F3E7FC559F4F49"
        et="Trial"
        ad="2012-01-12T21:58:13Z"
        ed="2012-06-30T21:58:13Z"
        sd="2012-01-12T00:00:00Z" 
        te="2012-06-30T02:49:34Z"
        ts="0"
        test="true"/>
      <d>VNNAnf36IrkyUVZlihQJNdUUZl/YFEfJOeldWBtd3IM=</d>
    </r>
    ```
    
   If the user is signed in with their organizational identity, the`oid` attribute value is set and the `cid` value is blank, as shown in the following example.
    
    ```XML
    <r>
      <t 
        aid="WA900006056"
        pid="{4FB601F2-5469-4542-B9FC-B96345DC8B39}"
        cid=""
        oid="4e8c79ae-327e-495b-a797-fdee87648816"
        et="Trial"
        ad="2012-01-12T21:58:13Z"
        ed="2012-06-30T21:58:13Z"
        sd="2012-01-12T00:00:00Z"
        te="2012-06-30T02:49:34Z"
        ts="0"
        test="true"/>
      <d>VNNAnf36IrkyUVZlihQJNdUUZl/YFEfJOeldWBtd3IM=</d>
    </r>
    ```
    
5. Select **Debug** > **Start debugging**, or select F5.
     
   > [!NOTE]
   > At the time of publication, Visual Studio displays a message that there were deployment errors, and the license token specified in the `<d>` tag won't be loaded. However, the other values in the license are loaded and are available to your add-in license check code.

6. To visually confirm that the test license is loaded, select the pop-out menu in the upper-right corner of the add-in pane, and then select **Security Info**.

### To load a test license from the file system

1. Create a folder that is accessible via a UNC path (c:\\<i>folder</i> or \\\\<i>server</i>\\<i>share</i>).
2. Add the manifest file for your add-in to the folder (the file name must have an .xml extension).

    ```XML
    <?xml version="1.0" encoding="utf-8"?>
    <OfficeApp xmlns="http://schemas.microsoft.com/office/appforoffice/1.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="ContentApp">
    <Id>9C4675F6-45A0-47EE-B9A4-D834F45467672</Id>
    <Version>15.0</Version>
    <ProviderName>Microsoft</ProviderName>
    <DefaultLocale>en-us</DefaultLocale>
    <DisplayName DefaultValue="GetToken">
    </DisplayName>
    <Description DefaultValue="Get Token">
    </Description>
    <Hosts>
        <Host Name="Workbook"/>
    </Hosts>
    <DefaultSettings>
        <SourceLocation DefaultValue="http://MyServer/GetToken.htm">
        </SourceLocation>
        <RequestedWidth>400</RequestedWidth>
        <RequestedHeight>400</RequestedHeight>
    </DefaultSettings>
    <Permissions>ReadWriteDocument</Permissions>
    <AllowSnapshot>true</AllowSnapshot>
    </OfficeApp>
    ```

3. Add the token file to the folder. The token file name must be the same as the manifest file name and must have a .tok file extension. The following code shows an example token file. Refer to the [Office and SharePoint Add-in license XML schema structure](add-in-license-schema.md) for details about the attribute values you can set in the `<t>` element of the token file.
    
    ```XML
    <r>
      <t 
        aid="WA900006056"
        pid="{4FB601F2-5469-4542-B9FC-B96345DC8B39}"
        cid="32F3E7FC559F4F49"
        et="Trial"
        ad="2012-01-12T21:58:13Z"
        ed="2012-06-30T21:58:13Z"
        sd="2012-01-12T00:00:00Z"
        te="2012-06-30T02:49:34Z"
        ts="0"
        test="true"/>
      <d>VNNAnf36IrkyUVZlihQJNdUUZl/YFEfJOeldWBtd3IM=</d>
    </r>
    ```
    
4. Create an entry in the registry that points to the manifest under one of the following paths:
    
   - `HKEY_CURRENT_USER\Software\Microsoft\Office\15.0\Wef\Developer` (Office 2013)
   - `HKEY_CURRENT_USER\Software\Microsoft\Office\16.0\Wef\Developer` (Office 2016)
    
   You can use a .reg file, as shown in the following example. (Note that the name field, `"entry1"` and the .xml file name in this example are arbitrary.)
    
    ```
    Windows Registry Editor Version 5.00
    
    [HKEY_CURRENT_USER\Software\Microsoft\Office\16.0\Wef\Developer]
    "entry1"="C:\\folder\\AppFile.xml"
    ```

## Add license checks to your SharePoint Add-in

You can create test licenses and import them into your SharePoint deployment. To assist in testing the add-in license checking code, SharePoint enables you to upload up to ten test licenses per deployment. These test licenses are XML fragments that conform to the [Office and SharePoint Add-in license XML schema structure](add-in-license-schema.md).

To import test licenses, use the [ImportAppLicense](https://msdn.microsoft.com/en-us/library/office/microsoft.sharepoint.client.utilities.utility.importapplicense.aspx) method. To call this method, the caller must be one of the following:

- An administrator of the site collection being called.
- An administrator of the tenancy into which the license is imported, if the SharePoint deployment into which the license is imported is a tenancy.
- A farm administrator.

After you import the test licenses, they appear in the SharePoint UI, and you can manage, assign, and delete them.

For test licenses, you don't have to specify the deployment ID in the add-in license XML. The [ImportAppLicense](https://msdn.microsoft.com/en-us/library/office/microsoft.sharepoint.client.utilities.utility.importapplicense.aspx) method supplies the correct deployment ID to the license token XML.

<a name="bk_example_import"> </a>
### Code example: Import a test license token into SharePoint

The following example takes a test add-in license token and imports it into the specified SharePoint installation.

```csharp
// For this example to work, you must add a reference in your project to Microsoft.SharePoint.Client.dll and Microsoft.SharePoint.Client.Runtime.dll.

string rawXMLEntitlementToken = <token that you want to import>;
string webUrl = "http://localhost" // This localhost URL should be replaced with the URL of any site within the tenancy into which 
// You want to import the license.

using (ClientContext ctx = new ClientContext(webUrl))
{
    Microsoft.SharePoint.Client.Utilities.Utility.ImportAppLicense(
        context: ctx,
        licenseTokenToImport: rawXMLEntitlementToken,
        contentMarket: "en-US", // Replace this with whatever content market you want
        billingMarket8; "US", // Replace this with whatever billing market you want
        appName: "add-in Name", // Replace this with the name of the app
        iconUrl: "http://www.office.com", // Replace this with the URL of the icon of the add-in (as it appears on Office Store),
// Or you can simply leave the URL blank.
        providerName: "Provider Name"); // Replace this with the name of the provider of the app

    ctx.ExecuteQuery();
}

```

<a name="SP15Implementlicense_bk_implement"> </a>
### Implement add-in license checks in your SharePoint Add-in code

Identify where in your add-in you want to check for a valid license or other license information; for example, when the add-in launches, or when the user goes to a specific page or accesses certain features. Add code at these points that queries your SharePoint deployment for the license token, and then passes that token to the Office Store verification web service for validation.

To retrieve the license token from SharePoint, use the [GetAppLicenseInformation](https://msdn.microsoft.com/en-us/library/office/microsoft.sharepoint.client.utilities.utility.getapplicenseinformation.aspx) method. This method returns all licenses for the specified add-in that apply to the user, based on the add-in product ID in the manifest file.

If multiple licenses are purchased for the same add-in by using different Microsoft accounts, the licenses are returned in the following order of priority:

- Paid
- Free
- Unexpired Trial
- Expired Trial
     
The [GetAppLicenseInformation](https://msdn.microsoft.com/en-us/library/office/microsoft.sharepoint.client.utilities.utility.getapplicenseinformation.aspx) method does not return licenses with expired or preserved tokens. Preserved tokens are the license tokens that cannot be renewed automatically by SharePoint. To remain valid, preserved tokens must be renewed manually by having the purchaser sign in to the Office Store.

#### Code example: retrieve add-in license tokens

The following example retrieves all the add-in licenses for the current user as a collection that can be iterated through.

```csharp
// For this example to work, you must add a reference in your project to Microsoft.SharePoint.Client.dll and Microsoft.SharePoint.Client.Runtime.dll.
// For this API to work, the SharePoint deployment you are calling must be able to communicate with ACS to validate OAuth tokens.

string webUrl = "http://localhost" // This localhost URL should be replaced with the URL of the add-in web or host web of the app.
    // If you are redirected from the add-in web to the third-party side executing this code
    // in the code-behind, you can get the add-in web URL with 
    // HttpContext.Current.Request.QueryString["AppWebUrl"].

productId = new Guid(<product ID of the app>);
using(ClientContext ctx = new ClientContext(webUrl))
{
    ClientResult<AppLicenseCollection> licensecollection = Microsoft.SharePoint.Client.Utilities.Utility.GetAppLicenseInformation(ctx, productId);
    ctx.ExecuteQuery();
}

```

By the end of this example, `licensecollection` includes all the add-in licenses for the current user as a collection of [AppLicense](https://msdn.microsoft.com/en-us/library/office/microsoft.sharepoint.client.applicense.aspx) objects. You can use the [RawXMLLicenseToken](https://msdn.microsoft.com/en-us/library/office/microsoft.sharepoint.client.applicense.rawxmllicensetoken.aspx) property to access the license token XML. So, for example, to access the license token for the first add-in license token in the collection, you use `licensecollection.Value[0].RawXMLLicenseToken`.

> [!IMPORTANT]
> Do not to parse or otherwise manipulate the add-in license token string before passing it to the Office Store license verification web service for verification. Although the add-in license token is structured as an XML fragment, for purposes of validation, the Office Store verification web service treats the token as a literal string. The Office Store verification web service compares the contents of the `<t>` element to the value of the `<d>` element, which is an encrypted signature derived from the literal string contained in the `<t>` element. Any reformatting of the license token, such as adding white space, tabs, or line breaks, changes the literal value of the `<t>` element and causes the license verification check to fail. 

#### Validating the add-in license token

After you retrieve the appropriate add-in license token, pass that token to the Office Store verification web service for validation. The verification service is located at the following URL:

`https://verificationservice.officeapps.live.com/ova/verificationagent.svc`

The verification service has a single method, [VerifyEntitlementToken](https://msdn.microsoft.com/en-us/library/office/verificationsvc.verificationserviceclient.verifyentitlementtoken.aspx), which takes the add-in license token as a parameter and returns a  [VerifyEntitlementTokenResponse](https://msdn.microsoft.com/en-us/library/office/verificationsvc.verifyentitlementtokenresponse.aspx) object that contains the properties of the license. The [IsValid](https://msdn.microsoft.com/en-us/library/office/verificationsvc.verifyentitlementtokenresponse.isvalid.aspx) property specifies whether the license token is valid, and other properties, such as [ProductId](https://msdn.microsoft.com/en-us/library/office/verificationsvc.verifyentitlementtokenresponse.productid.aspx) and [EntitlementType](https://msdn.microsoft.com/en-us/library/office/verificationsvc.verifyentitlementtokenresponse.entitlementtype.aspx), contain information about the various license attributes.

The Office Store license verification web service also supports verifying add-in license tokens by using REST calls. To verify an add-in license by using REST, use the following syntax:

`https://verificationservice.officeapps.live.com/ova/verificationagent.svc/rest/verify?token={token}`

Where `{token}` is the add-in license token, encoded by a method that complies with RFC 2396; for example, the **encodeURIComponent()** function in JavaScript, or the **Uri.EscapeDataString** method in the .NET Framework. The Office Store verification service does not support being called from client-side code.

> [!NOTE]
> If you're hosting your add-in pages on SharePoint, you can use the SharePoint web proxy to make JavaScript calls to the Office Store verification service. However, for security reasons we strongly recommend that you use only server-side code to query the Office Store verification web service.

> [!WARNING]
> Do not store the license token by using a service or application that adds a byte order mark (BOM) to the license token string. Including this character in the license token passed to the verification service causes the license check to fail. If you do use an application that adds a BOM to the token, you must remove this character before passing the license token to the verification service.

<a name="SP15implementlicense_bk_take"> </a>
### Take action based on the SharePoint Add-in license

Add code to your add-in that takes the appropriate actions, based on whether the license is valid and, if it is valid, any other license information that is important to you; for example, add code that enables the user to access certain features if their license is for the paid version, but not if their license is for the trial version of the add-in.

<a name="SP15implementlicense_bk_add"> </a>
### Add code to block test licenses

Finally, after you finish testing your add-in and are ready to move it to production, you need to add code to the license checks so that the add-in no longer accepts test licenses. This prevents users from using test licenses to access your add-in on their SharePoint deployment.
 
After you pass the license token to the verification service's [VerifyEntitlementToken](https://msdn.microsoft.com/en-us/library/office/verificationsvc.verificationserviceclient.verifyentitlementtoken.aspx) method, you can use the [VerifyEntitlementTokenResponse](https://msdn.microsoft.com/en-us/library/office/verificationsvc.verifyentitlementtokenresponse.aspx) object returned by that method to access the license properties. For test licenses, the [IsTest](https://msdn.microsoft.com/en-us/library/office/verificationsvc.verifyentitlementtokenresponse.istest.aspx) property returns **true** and the [IsValid](https://msdn.microsoft.com/en-us/library/office/verificationsvc.verifyentitlementtokenresponse.isvalid.aspx) property returns **false**.

<a name="bk_example"> </a>
### Code example: SharePoint Add-ins licensing checking

The following example retrieves an add-in's license token from the SharePoint deployment and passes the token to the Office Store verification service for validation. The example catches a variety of possible errors if the verification fails. If the verification succeeds, it builds a string from the various license properties. Finally, the code provides logic for specifying the level of functionality based on the license type: Free, Paid, or Trial. 

This example requires a reference to  [Microsoft.SharePoint.Client.Utilities](https://msdn.microsoft.com/en-us/library/office/microsoft.sharepoint.client.utilities.aspx), and a web service reference to the Office Store verification service.

```csharp
//Get the license token XML from SharePoint.
this.rawToken = GetLicenseTokenFromSP(this.productId, this.clientcontext);

//Call the Office Store verification service.
VerifyLicenseToken(this.rawToken);

private string GetLicenseTokenFromSP(Guid productId, ClientContext clientContext)
{
    //Get the license from SharePoint.
    ClientResult<AppLicenseCollection> licenseCollection = Utility.GetAppLicenseInformation(clientContext, productId);
    clientContext.Load(clientContext.Web);
    clientContext.ExecuteQuery();

    foreach (AppLicense license in licenseCollection.Value)
    {
        //Just get the first license token for now.
        rawLicenseToken = license.RawXMLLicenseToken;
        break;
    }
    return (rawLicenseToken);
}

private void VerifyLicenseToken(string rawLicenseToken)
{    
    if (string.IsNullOrEmpty(rawLicenseToken))
    {
        licVerifyEndPoint.Text = "There is no valid license for this user in SharePoint (OR) license cannot be obtained due to some error - check ULS.";
        return;
    }

    VerificationServiceClient service = null;
    VerifyEntitlementTokenResponse result = null;
    VerifyEntitlementTokenRequest request = new VerifyEntitlementTokenRequest();
    request.RawToken = rawLicenseToken;
    lblSPLicenseText.Text = System.Web.HttpUtility.HtmlEncode(request.RawToken);   

    try
    {
        service = new VerificationServiceClient();
        result = service.VerifyEntitlementToken(request);
    }
    catch (EndpointNotFoundException)
    {
        licVerifyEndPoint.Text = "Cannot access verification service endpoint";
    }
    catch (FaultException<ServiceUnavailableFault>)
    {
        licVerifyEndPoint.Text = "Error: entitlement verification service is unavailable.";
    }
    catch (FaultException<ServiceInternalErrorFault> internalFault)
    {
        licVerifyEndPoint.Text = "Error: entitlement verification service failed. Details: " + internalFault.Detail.Message;
    }
    catch (Exception exception)
    {
        licVerifyEndPoint.Text = "Error: entitlement verification service failed. Details: " + exception;
    }

    if (result != null &amp;&amp; result.AssetId !=null)
    {
        string licenseDetails = string.Format("Asset Id: {0}; Product Id: {1}; License Type: {2}; Is Valid: {3}; License Acquisition Date: {4}; License Expiry Date: {5}; IsExpired: {6}; IsTest: {7}; IsSiteLicense: {8}; Seats: {9}; TokenExpiryDate: {10}",
                result.AssetId, result.ProductId, result.EntitlementType, result.IsValid, result.EntitlementAcquisitionDate, result.EntitlementExpiryDate, result.IsExpired, result.IsTest, result.IsSiteLicense, result.Seats, result.TokenExpiryDate);

        if (result.EntitlementType.ToUpper() == "FREE")
        {
          //Allow basic functionality
        }
        else if (result.EntitlementType.ToUpper() == "PAID")
        {
          //Allow all functionality
        }
        else //trial
        {
          //Allow limited functionality
        }
    }
            else
    {
        licVerifyEndPoint.Text = "Verification service didn't return any results";
    }
}

```

## Additional resources

- [How licenses work for Office and SharePoint Add-ins](how-licenses-work.md)
- [Implement licensing to upsell your Office Add-in services](implement-licensing-for-add-in-services.md)
- [Office and SharePoint Add-in license XML schema structure](add-in-license-schema.md)
- [VerificationSvc namespace](https://msdn.microsoft.com/en-us/library/verificationsvc.aspx)
- [SharePoint 2013 code sample: Import, validate, and manage app licenses](https://code.msdn.microsoft.com/SharePoint-2013-Import-f5f680a6)
- [License your Office and SharePoint Add-ins](license-your-add-ins.md)
- [Submit your solutions to the Office Store](submit-to-the-office-store.md)


