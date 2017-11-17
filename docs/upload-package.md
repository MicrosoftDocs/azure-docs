# Upload your package to the Office Store

On the Overview page in the Seller Dashboard, under **App package**, you upload your manifest. The upload process varies based on your submission type.

## Upload your Office Add-in manifest

Choose the tile under **App package**, and upload the manifest file for your add-in.

When you upload your manifest file, you might get one of the following messages:

- Manifest errors. If your manifest contains errors, the Seller Dashboard will report those errors and you will have to resolve them before you can submit your add-in.
- Applications and platforms supported. Office apps, platforms, and operating systems are specified in the **Requirements** element in your manifest. For more information, see [Office Add-in host and platform availability](https://dev.office.com/add-in-availability).

## Upload your SharePoint Add-in manifest

Choose the tile under **App package**, and upload the manifest file for your add-in.

If your add-in uses OAuth, select the **My app is a service and requires server to server authorization** check box. The OAuth Client ID dropdown field appears. Select the OAuth client ID that you want your add-in to use. For more information, see [Create or update client IDs and secrets in the Seller Dashboard](create-or-update-client-ids-and-secrets.md).

To submit a SharePoint Add-in that uses OAuth that you want to distribute it to China:

- Use a separate client ID and client secret for China.
- Add a separate add-in package specifically for China.
- Block access for all countries except China.
- Create a separate add-in listing for China.

For more information, see [Submit apps for Office 365 operated by 21Vianet in China](submit-apps-for-office-365-operated-by-21vianet-in-china.md).

## Upload an Office 365 web app

Office 365 web apps are registered in Azure Active Directory (Azure AD) and do not have a manifest. Instead, you must provide the app ID.

Under **App registration**:

- Provide an Azure app ID. When you register your web app with Microsoft Azure AD, an Azure app ID in the form of a GUID is created.
- Choose the Azure AD instance that your app uses. The following are the options: 
    - Azure Active Directory Global - Use for most Office 365 web apps.
    - Azure Active Directory China - Use for web apps created with Office 365 in China.
    - Microsoft account - Not currently available.
    - Microsoft account + Azure Active Directory Global – Use for web apps that support MSA and OrgID accounts 

## Upload a Power BI custom visual    

To submit a Power BI custom visual, send an email to the Power BI custom visuals submission team at [pbivizsubmit@microsoft.com](mailto:pbivizsubmit@microsoft.com). Attach the following to your email:

- The .pbiviz file 
- The sample report .pbix file

The Power BI team will reply back with instructions and a manifest XML file to upload. This XML manifest is required in order to submit your custom visual to the Office Store.

> [!NOTE]
> To help ensure quality and make sure that existing reports do not break, updates to existing custom visuals will take approximately two weeks to reach the general public after approval. 

For more details about submitting Power BI custom visuals, see [Publish custom visuals to the Office store](https://powerbi.microsoft.com/en-us/documentation/powerbi-developer-office-store/).

## Upload a Microsoft Teams app

Choose the tile under **App package**, and upload the manifest file for your add-in. When you upload your manifest file, you might get the following message: Errors exist.

If your package contains errors, the Seller Dashboard will report those errors and you will have to resolve them before you can submit your add-in. 

For more details about Microsoft Teams app packages, see [Create the package for your Microsoft Teams app](https://msdn.microsoft.com/en-us/microsoft-teams/createpackage). For a step-by-step guide that describes how to submit a Microsoft Teams app, see [Submitting your Microsoft Teams app in the Seller Dashboard](https://msdn.microsoft.com/en-us/microsoft-teams/submissionguidance).
