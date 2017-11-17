# Validation policies for apps and add-ins submitted to the Office Store (version 2.2)

This document describes the criteria that are used to validate that Office Add-ins, SharePoint Add-ins, Microsoft Teams apps, and Power BI custom visuals are eligible to be listed in the Office Store.
 

## 1. Apps and add-ins provide value to the Office Store customer
<a name="bk_1"> </a>


|Policy number|Description|
|:-----|:-----|
|1.1|Your app or add-in must offer unique value or utility within the app or add-in experience that extends Office or SharePoint functionality for Office Store customers.|
|1.2|Your app or add-in must work according to your description, and must not be in an unfinished state.|
|1.3|Your app or add-in's trial functionality must reasonably resemble its paid version.|

## 2. Office Store apps or add-ins can display certain ads
<a name="bk_2"> </a>

|Policy number|Description|
|:-----|:-----|
|2.1|Apps or add-ins can contain ads. The primary purpose of the app or add-in must be more than the display of the advertisement.|
|2.2|Ads in your app or add-in must comply with our content policies, described in policy 6.|
|2.3|Ads should not interfere with app or add-in functionality and should match our ad design guidelines.|
|2.4|The elements of your app or add-in's description, such as screenshots, text, and promotional images, must describe your app or add-in and not contain additional advertising.|

## 3. Apps and add-ins can sell additional features or content through purchases within the app or add-in
<a name="bk_3"> </a>

|Policy number|Description|
|:-----|:-----|
|3.1|Currently, Microsoft does not provide native application programming interfaces (APIs) to support purchases in apps and add-ins. You may use any third-party payment system for those purchases.|
|3.2|Where an app or add-in requires additional features to operate as advertised, to which an extra charge applies, you must clearly notify users in your description that those payments are required to access those features. Notification is also necessary if your app or add-in offers additional features or content for sale, either through purchases within the app or add-in or other means. |
|3.3|If your app or add-in collects credit card information or uses a third-party payment processor that collects credit card information, the payment processing must meet the current PCI Data Security Standard (PCI DSS).|
|3.4|Apps or add-ins running on iOS must not offer any additional features or content for sale.|

## 4. Apps and add-ins behave predictably
<a name="bk_4"> </a>

|Policy number|Description|
|:-----|:-----|
|4.1|Your app or add-in must not stop responding, end unexpectedly, or contain programming errors.|
|4.2|Your updated app or add-in must not decrease the app or add-in's functionality in a way that would be unexpected to a reasonable customer.|
|4.3|Your app or add-in description, imagery, documentation and any other associated metadata must be consistent with the functionality of the app or add-in.|
|4.4|You must provide instructions and links to resources in the submission form's testing notes that will be needed for Microsoft validation of your app or add-in. If, for example, your app or add-in requires a login/password, you must give Microsoft a pre-existing working login for testing purposes.|
|4.5|Your app or add-in must not make unexpected changes to a customer's document.|
|4.6|Your app or add-in must not jeopardize or compromise the security or functionality of Microsoft or third-party products.|
|4.7|The app or add-in must be free of viruses, malware, and any malicious software.|
|4.8|Your app or add-in must not launch functionality outside of the app or add-in experience without the explicit permission of the user.|
|4.9|No action should take more than three seconds to respond without some type of loading UX or warning.|
|4.10|Your app or add-in should not consume an unreasonable amount of memory that negatively impacts the performance of an average customer's environment.|
|4.11|Your app or add-in UI should not look unfinished.|
|4.12|Your app or add-in must be fully functional with the supported operating systems, browsers, and devices for Office 2013, Office 2016, SharePoint 2013, and Office 365. To download an Office 2013 trial, see [Office 2013 - Microsoft Office 365](https://c2rsetup.officeapps.live.com/c2r/download.aspx?productReleaseID=O365HomePremRetail&platform=X86&language=en-us&version=O15GA&source=O15OLSO365) or [Office 2013 - Microsoft Office 365 Business](https://c2rsetup.officeapps.live.com/c2r/download.aspx?productReleaseID=O365BusinessRetail&platform=X86&language=en-us&version=O15GA&source=O15OLSO365).<br/><br/>Your app or add-in's described features must work on a touch-only device without a physical keyboard or mouse.|
|4.12.1  **Office Add-ins**| General requirements:<br/><br/><ul><li>Add-ins must be compatible with all versions of Internet Explorer 11 and later, and the latest versions of Microsoft Edge, Chrome, Firefox, and Safari (Mac OS).</li><li>Your add-in must work in all Office applications specified in the **Hosts** element in your add-in manifest. For details, see [Specify Office hosts and API requirements](https://dev.office.com/docs/add-ins/overview/specify-office-hosts-and-api-requirements).</li><li>Your add-in must work across all platforms that support the methods that you define in the **Requirements** element in your add-in manifest. For details about which platforms support which methods, see [Office Add-in host and platform availability](https://dev.office.com/add-in-availability).</li></ul> |
|| Platform-specific requirements:<br/><ul><li>Your add-in must support Office Online applications that are compatible with the APIs listed in the **Requirements** element. To test your add-in in Office Online, see [Debug add-ins in Office Online](https://dev.office.com/docs/add-ins/testing/debug-add-ins-in-office-online).</li><li>Add-ins that support iOS must be fully functional on the latest iPad device using the latest iOS operating system.</li></ul>|
|| Outlook-specific requirements:<br/><ul><li>If your scenario requires showing an add-in on every message or appointment (whether in read or compose), it must support [add-in commands](https://dev.office.com/docs/add-ins/outlook/add-in-commands-for-outlook).</li><li>Outlook add-ins must not include the CustomPane extension point in the VersionOverrides node.</li><li>If your add-in manifest includes the **SupportsPinning** element for read mode of a message and/or appointment, the content of the add-in, when pinned, must not be static and must clearly display data related to the message that is open or selected in the mailbox.</li><li>Outlook add-ins that support mobile must allow users to log on separately for each email account they have in the Outlook app.</li></ul>|
|| Word, Excel, and PowerPoint requirements:<br/><br/>Add-ins that use the taskpane manifest must support add-in commands.|
|4.12.2  **SharePoint Add-ins**|Add-ins must be fully functional with Windows 7, Windows 10, all versions of Internet Explorer 11 and later, and the latest versions of Microsoft Edge, Chrome, and Firefox.|
|4.12.3  **Web apps using Azure AD**|Your app must correctly use either OAuth and OpenID Connect protocols, or SAML protocols. For more information, see [Have your add-in appear in the Office 365 add-in launcher](https://msdn.microsoft.com/en-us/office/office365/howto/connect-your-app-to-o365-app-launcher).<br/><br/>Two types of apps are supported:<ul><li>**User consentable**. A user cannot be blocked from authenticating and consenting to a user consentable app. If you want to do a user authorization check, you must do so after authentication and consent.</li><li>**Admin consentable**. Only an admin can consent to an admin consentable app. These apps require permissions that can give broad access to the tenant data. If you are submitting an admin consentable app, indicate that in the Testing notes. A user cannot be blocked from authenticating and consenting to an app. If you want to do a user authorization check, you must do so after authentication and consent.</li></ul>Apps must be fully functional with Windows 7, Windows 10, all versions of Internet Explorer 11 and later, and the latest versions of Microsoft Edge, Chrome, and Firefox.|
|4.13|Your SharePoint Add-in must not have remote debugging settings enabled.|
|4.14|The manifest for your SharePoint Add-in must not include the **DebugInfo** element.|
|4.15|Your SharePoint Add-in must not have any unauthenticated pages or APIs, with the exception of the error page. |
|4.16|The (unauthenticated) error page should not have links to other pages or other protected resources of the add-in.|
|4.17|Deleted.|
|4.18|Your add-in may not alter, or promote the alteration of, SharePoint or Office except via the Office and SharePoint Add-ins model.|
|4.19|Your app experience must not prompt a user to disclose the credentials of a Microsoft identity (for example, Office 365 or Microsoft Azure Organizational Account, Microsoft Account, or Windows Domain Account) except through Microsoft approved OAuth flow, where your app is authorized to act on behalf of the user.For more information, see  [Context Token OAuth flow for SharePoint Add-ins](http://msdn.microsoft.com/library/context-token-oauth-flow-for-sharepoint-add-ins%28Office.15%29.aspx) and [Authorization Code OAuth flow for SharePoint Add-ins](http://msdn.microsoft.com/library/authorization-code-oauth-flow-for-sharepoint-add-ins%28Office.15%29.aspx).|
|4.20|If your app or add-in depends on additional services or accounts, this dependency must be clearly called out in the description you submit in the Seller Dashboard.|
|4.21|Your app or add-in must not install or launch other executable code on the user's environment.|

## 5. Apps and add-ins put the customer in control
<a name="bk_5"> </a>

|Policy number|Description|
|:-----|:-----|
|5.1|You must submit a privacy link. The linked privacy documentation must be clearly titled as such. The content of the privacy statement must be under the direct control of the app or add-in provider.If your app or add-in does not collect or transmit user information, you must link to a statement that states this fact.For information about common mistakes to avoid, see  [How can I avoid errors when submitting my app or add-in to the Office Store?](office-store-submission-faq.md#bk_q2) in [Office Store submission FAQ](office-store-submission-faq.md).|
|5.2|Your app or add-in must obtain consent to publish personal information.|
|5.3|Your app or add-in must not obtain or store customer information or content without notifying the user.|
|5.4|Your app or add-in must not pass or transmit customer data without notifying the user.|
|5.5|Your app or add-in must protect customers from unintentional large data transfers over metered networks.|
|5.6|Your app or add-in must not implement geo-blocking of customers without explicitly stating this in the description.|
|5.7|Apps and add-ins must be secured with a valid and trusted SSL certificate (HTTPS). For more information, see  [Why do my apps and add-ins have to be SSL-secured?](office-store-submission-faq.md#bk_q7) in [Office Store submission FAQ](office-store-submission-faq.md).|
|5.8|Apps and add-ins may not open pop-up windows unless they are triggered by explicit user interaction. Any pop-up windows that are triggered by user interaction must not be blocked by the browser's pop-up blocker when the pop-up blocker is set to the default value.|
|5.9|Your app or add-in cannot request full-control permission. SharePoint Add-ins that request full-control permissions are not accepted in the Office Store.<br/><br/>If your app or add-in requires full-control permission, your Store add-ins might be dependent on add-ins that are deployed to a customer's tenant outside the Store process. For more information, see  [Combining Office store add-ins with high trust permissions now supported](https://dev.office.com/blogs/combining-store-add-ins-with-high-trust-permissions).|
|5.9.1|SharePoint Add-ins must prompt the administrator to explain that the add-in must install a full-control app. The administrator must be able to install this full-control app without interacting with the SharePoint Add-in provider, for example via email or web forms.|
|5.9.2|The full-control app that is installed via the SharePoint Add-in must comply with all Store policies. |
|5.9.3|If the full-control app meets the Office Store validation policies, the SharePoint Add-in submitted to the Office Store can function only to install the full-control app.|
|5.10|You must specify an icon for your app or add-in in your add-in package or manifest, and that the icon must be correctly sized and formatted.For more information, see  *How can I avoid errors when submitting my app or add-in to the Office Store?*  in [Office Store submission FAQ](office-store-submission-faq.md)|
|5.11|Content add-ins for PowerPoint which use restricted permissions are required to clearly display links to their Privacy Policy and Terms of Use information on the first screen of the add-in. If your add-in does not collect or transmit user information, you must link to a statement that states this fact.|
|5.12|Content add-ins for PowerPoint may not activate their content (e.g. play audio or video) until after  [Office.initialize event (JavaScript API for Office)](http://msdn.microsoft.com/library/727adf79-a0b5-48d2-99c7-6642c2c334fc%28Office.15%29.aspx) has been called. This ensures that content display will synchronize with presentations correctly.|

## 6. Apps and add-ins are appropriate for a global audience
<a name="bk_6"> </a>

|Policy number|Description|
|:-----|:-----|
|6.1|Your app or add-in must not contain adult content.|
|6.2|Your app or add-in must not contain content that advocates discrimination, hatred, or violence based on membership in a particular racial, ethnic, national, linguistic, religious, or other social group, or based on a person's gender, age, or sexual orientation.|
|6.3|Your app or add-in must not contain content or functionality that encourages, facilitates or glamorizes illegal activity.|
|6.4|Your app or add-in must not contain or display content that a reasonable person would consider to be obscene.|
|6.5|Your app or add-in must not contain content that is defamatory, libelous or slanderous, or threatening.|
|6.6|Your app or add-in must not contain content that encourages, facilitates or glamorizes excessive or irresponsible use of alcohol or tobacco products, drugs or weapons.|
|6.7|Your app or add-in must not contain content that encourages, facilitates or glamorizes extreme or gratuitous violence, human rights violations, or the creation or use of weapons against a person or animal.|
|6.8|Your app or add-in must not contain excessive or gratuitous profanity.|
|6.9|It is your responsibility to determine if you have the right to use the chosen name, content, logos, copyright, trademarks, code, online services and APIs.|
|6.10|Your app or add-in must not encourage, promote, or enable piracy of copyrighted content.|
|6.11|You must provide details on the submission form if your app or add-in calls, supports, contains, or uses cryptography.|
|6.12|Your app or add-in must not be designed or marketed to perform, instruct, or encourage tasks that could cause physical or psychological harm to a customer or any other person.|
|6.13| If your app or add-in is a game distributed in markets which require a game rating, you must make the rating available in your description. Supported ratings boards include: CERO CRB DJCTZ ESRB FPB GRB OFLC - New Zealand PEGI USK|
|6.14|Your app or add-in must comply with all applicable laws in the regions in which it is available.|

## 7. Apps and add-ins are easily identified and understood
<a name="bk_7"> </a>

|Policy number|Description|
|:-----|:-----|
|7.1|The metadata that you submit with your app or add-in must be accurate. For information about common mistakes to avoid, see [How can I avoid errors when submitting my app or add-in to the Office Store?](office-store-submission-faq.md#bk_q2) in [Office Store submission FAQ](office-store-submission-faq.md).|
|7.2|Your app or add-in must have a unique name.|
|7.3|Your app or add-in's title, description, and images must reflect its functionality, and may not mislead the user. If you make changes to your app or add-in such that the functionality does not match the description, you must resubmit your app or add-in. |
|7.4|Your app or add-in title and short description must convey its purpose. Do not rely exclusively on familiarity with a brand or service to convey the purpose of your app or add-in. |
|7.4.1|You must localize your app or add-in metadata (descriptions, screenshots, title) to be easily understood for each submitted languages.|
|7.4.2|The primary language selected when you submit your add-in must be one of the supported languages within your add-in's functionality as declared in your add-in's manifest. |
|7.4.3|This policy does not apply to dictionary add-in submissions.|
|7.4.4|You must specify language support for your add-in in your add-in's manifest. |
|7.4.5|If your app or add-in targets a larger organization or enterprise, the title can use your brand or service. For more information, see  [Office Store validation policy changes to support apps and add-ins that target larger organizations and enterprises](https://dev.office.com/blogs/office-store-validation-policy-changes-to-support-apps-and-add-ins-that-target-larger-organizations-and-enterprises).|
|7.5| Apps or add-ins listed in multiple languages must be easily identified and understood. The Office Store supports merchandising of apps and add-ins in the following languages:<br/><br/>Arabic<br/>Bulgarian<br/>Chinese (Simplified)<br/>Chinese (Traditional)<br/>Croatian<br/>Czech<br/>Danish<br/>Dutch<br/>English<br/>Estonian<br/>Finnish<br/>French<br/>German<br/>Greek<br/>Hebrew<br/>Hindi<br/>Hungarian<br/>Indonesian<br/>Italian<br/>Japanese<br/>Kazakh<br/>Korean<br/>Latvian<br/>Lithuanian<br/>Malay (Latin)<br/>Norwegian (Bokmål)<br/>Polish<br/>Portuguese (Brazil)<br/>Portuguese (Portugal)<br/>Romanian<br/>Russian<br/>Serbian (Latin)<br/>Slovak<br/>Slovenian<br/>Spanish<br/>Swedish<br/>Thai<br/>Turkish<br/>Ukrainian<br/>Vietnamese<br/><br/>**Note:** English apps and add-ins are distributed to all Store-supported markets by default. Providers can block English apps and add-ins from distribution via Seller Dashboard. For more information, see *How do I declare language support for my add-in?*  in [Office Store submission FAQ](office-store-submission-faq.md). |
|7.6|Your app or add-in must not falsely declare language support.|
|7.7|The capabilities you declare must relate to the core functions and description of your app or add-in.|
|7.8|You must provide at least one screenshot of your app or add-in.|
|7.9|Your add-in's packages must be correctly formatted and conform to the current manifest schema. For Office Add-ins, this is manifest schema version 1.1.<br/><br/>For detailed manifest schema information, see  [Schema reference for Office Add-ins manifests (v1.1)](http://msdn.microsoft.com/library/7e0cadc3-f613-8eb9-57ef-9032cbb97f92%28Office.15%29.aspx) and [Schema reference for manifests of SharePoint Add-ins](http://msdn.microsoft.com/library/1f8c5d44-3b60-0bfe-9069-1df821220691%28Office.15%29.aspx). Also see *What are some common errors to avoid when submitting my add-in to the Office Store?*  in [Office Store submission FAQ](office-store-submission-faq.md).|
|7.10|The categories you assign your app or add-in must correspond to the character or purpose of the app or add-in.<br/><br/>**Note:** Non-productivity apps or add-ins must be categorized in the Lifestyle category and only in that category.|
|7.11|Your app or add-in must not be a duplicate of an app or add-in you've already submitted.|
|7.12|Your app or add-in must include the app or add-in name, version information, and technical support contact information that is easily discoverable.|
|7.13|The experience provided by an app or add-in must be reasonably similar in each language as declared in your add-in's manifest.<br/><br/>For more information, see *How do I declare language support for my add-in?*  in [Office Store submission FAQ](office-store-submission-faq.md).|
|7.14|Your add-in name may not include "app" or "plug-in" or derivatives.|
|7.15|All Office Add-ins must use the Microsoft-hosted Office.js file. For more information, see  *How do I reference the JavaScript APIs for Office in my add-ins?*  in [Office Store submission FAQ](office-store-submission-faq.md).|
|7.16|You must specify a valid Support URL in the  **SupportURL** element of your Office Add-in manifest.|
|7.16.1|Each app or add-in must have a unique name (for example, Test Add-in, Test Add-in: Premium).|
|7.16.2|The binary may remain the same across the multiple app or add-in listings.|
|7.16.3|We recommend, as best practice, that you notify users that multiple app or add-in listings exist in the description for each. This ensures that users are aware that different cost/functionality tiers are available. |
|7.17|If you wish to submit multiple variations of an app or add-in (for example, where different functionalities are unlocked at different price points), you must submit these separately, with separate product IDs. |
|7.18 **Education apps or add-ins**|An education app or add-in is used in a class or study context, by teachers and/or students.<br/><br/>An education app or add-in is submitted under the "Education" category.<br/><br/>An education app or add-in must provide in the testing notes at least one and up to three applicable subjects:<br/><br/>Math<br/>Literacy (English Language Arts)<br/>Science<br/>Social Studies<br/>Health and Fitness<br/>Engineering and Technology<br/>Business, Finance, and Economics<br/>Computer Science<br/>Languages<br/>Art and Music<br/>Teaching Tools and Resources<br/><br/>An education app or add-in must provide in the testing notes a minimum of one applicable age range:<br/><br/>Preschool and Kindergarten<br/>Elementary School (1st-5th Grade)<br/>Middle School (6-8th Grade)<br/>High School (9-12th Grade)<br/>Higher Education|
|7.19| You may not use Microsoft product names in your app or add-in title.<br/><br/>**Note:** We may make some exceptions in cases where an add-in runs in multiple Microsoft products; for example, Contoso for SharePoint, Contoso for Outlook, Contoso for Office 365.

## 8. Updates to paid apps or add-ins must not decrease the app or add-in's functionality
<a name="bk_9"> </a>

|Policy number|Description|
|:-----|:-----|
|8.1|If you update your app or add-in's pricing/licensing terms, you must continue to offer the original functionality to the existing customer base at the original pricing. New prices and/or licensing terms may only apply to new users.|
|8.2|If you update your app or add-in's pricing from free to paid, existing users must receive the same level of functionality as before the update.|
|8.3|If you update your app or add-in from supporting site licenses for free to not supporting them, existing users must continue to be supported for free.|
|8.4|Your app or add-in cannot be resubmitted more than ten times per month, up to a total of 30 times per year.|
|8.5|If you withdraw your app or add-in from sale, you must ensure any external web services and/or web pages that support the app or add-in will continue to function for 90 days. Failure to do so will make you responsible for refund liability towards your customers.|
|8.6|Apps and add-ins may convert from free to subscription pricing. If you update your app or add-in's pricing from free to subscription, existing users must receive the same level of functionality as before the update.<br/><br/>Converting from a paid to a subscription app or add-in is not currently supported.|

## 9. Refunds 
<a name="bk_10"> </a>

|Policy number|Description|
|:-----|:-----|
|9.1|If your app or add-in is found to violate any of our store policies, it can be removed from the Office Store. If a customer needs to be refunded, the refund will be deducted from any pending payouts to your account.|

## 10. Apps and add-ins utilize supported capabilities
<a name="bk_11"> </a>

|Policy number|Description|
|:-----|:-----|
|10.1|Your paid app or add-in must follow the Office Store commerce requirements. For more information, see  *Can I submit a paid app or add-in to the Office Store?*  in [Office Store submission FAQ](office-store-submission-faq.md).|
|10.2|If your SharePoint Add-in has autohosting capabilities, it will not be accepted in the Office Store. For more information, see  [Update on Autohosted Add-ins Preview program](https://blogs.office.com/2014/05/16/update-on-autohosted-apps-preview-program/).|
|10.3|The version number you specify for your add-in on the Seller Dashboard submission form must exactly match the version number in the add-in manifest.<br/><br/>You must specify your add-in version using the following syntax:<br/><br/>*a*  . *b*  . *c*  . *d*<br/><br/>Where  *a*  is an integer between 1-9999, and each of *b*  , *c*  , *d*  are each integers between 0-9999. For example, 1.0.0.0 or 6.23.0.1.|
|10.4|Add-ins that utilize deprecated functionality will not be allowed in the store.For more information, see  [SharePoint 2013: List of obsolete types and members](http://www.microsoft.com/en-us/download/details.aspx?id=40731).|
|10.5|Paid Outlook add-ins must support a site license.|
|10.6|Submitting Office Add-ins that are hosted within Access as paid add-ins is not currently supported.|
|10.7|Deleted.|
|10.8|For your Office Add-in to be available on iOS or Android, it must be free. It must not include "app" in the **App Title** or **App Short Description**. Your add-in must be free of in-app purchases, trial offers, UI that aims to upsell to paid, or links to any online stores where users can purchase or acquire other content, apps, or add-ins. Your Privacy Policy and Terms of Use pages must also be free of any commerce UI or Store links.<br/>For add-ins for iOS, you must also do the following on the Seller Dashboard submission form:<br/><br/>Accept Apple's Terms and Conditions by selecting the appropriate checkbox. Your Office Add-in must be compliant with all relevant Apple App Store policies.<br/><br/>Provide a valid Apple ID.|
|10.8.1|For your Outlook add-in to be available on iOS or Android, it must comply with the [Outlook add-in design guidelines](https://docs.microsoft.com/en-us/outlook/add-ins/outlook-addin-design).|
|10.8.2|The version of your add-in that runs on Office for iOS or Office for Android must not show any UI or language, or link to any other apps, add-ins, or websites, that ask the user to pay. Use of the term “free”, as in “free account”, is also not allowed. If the add-in requires an account, only free accounts can be created in the mobile version of the add-in. You can determine the length of time that the free account remains active (indefinitely or for a limited amount of time); however, if the user’s account expires, you cannot show any UI, text, or links to the user to indicate that they need to pay.
|10.9|Office Add-ins must use version 1.1 of the Office.js library and the manifest schema.|

## 11. Add-ins provide a seamless and fluid experience for Office Store customers
<a name="bk_12"> </a>

|Policy number|Description|
|:-----|:-----|
|11.1|Add-ins can fail validation for issues related to  [Office Add-in design guidelines](http://msdn.microsoft.com/library/d5b2ab2e-dfc8-47c8-919c-e9c23358d70c%28Office.15%29.aspx) and [SharePoint Add-in design guidelines](http://msdn.microsoft.com/library/design-sharepoint-add-ins%28Office.15%29.aspx) and which impede the customer experience within Office and SharePoint.|
|11.2|Add-ins that depend on external accounts or services must provide a clear and simple sign in/sign out and signup experience.|
|11.2.1|If your app or add-in targets a larger organization or enterprise and depends on external accounts or services, it must provide a clear and simple sign in/sign out experience. A signup experience is not required, as sign up will be managed by the enterprise outside of the app/add-in and not by the individual user.<br/><br/>For more information, see  [Office Store validation policy changes to support apps and add-ins that target larger organizations and enterprises](https://dev.office.com/blogs/office-store-validation-policy-changes-to-support-apps-and-add-ins-that-target-larger-organizations-and-enterprises).|
|11.3|Your Office Add-in must provide a seamless first run experience, with a clear value proposition. If users must sign in or sign up, the value proposition must be clear to the user before they do so.|
|11.3.1|If your app or add-in targets a larger organization or enterprise, a seamless first run experience and value proposition is not required. However, your add-in must include either an email contact or a link in the UI that users can click to learn more about your services.<br/><br/>For more information, see  [Office Store validation policy changes to support apps and add-ins that target larger organizations and enterprises](https://dev.office.com/blogs/office-store-validation-policy-changes-to-support-apps-and-add-ins-that-target-larger-organizations-and-enterprises).|
|11.4|The UI (buttons, links, text fields) of your add-in must be intuitive and obvious in their purpose. Users must not be required to read support content to perform basic operations. For more information, see  [Best practices for developing Office Add-ins](http://msdn.microsoft.com/library/013e1486-4482-42c1-bcda-edf8de06e771%28Office.15%29.aspx).|

## 12. Office Mix Add-ins
<a name="bk_12"> </a>

|Policy number|Description|
|:-----|:-----|
|12.1|Office Mix Add-ins must be for an educational purpose. |
|12.2|Office Mix Add-ins must be created using the Office Mix platform.|
|12.3|Office Mix Add-ins must be free.|
|12.4|Office Mix Add-ins must start in the Play View when published to Office Mix.|
|12.5|All restrictions that apply to content add-ins for PowerPoint also apply to Office Mix Add-ins. |

## 13. Power BI custom visuals

|Policy number|Description|
|:-----|:-----|
|13.1|Power BI custom visuals must be free and may not offer additional purchase.|
|13.2|Power BI custom visuals submitted to the Office Store must be accompanied by a sample file included in the same location as the pbviz file, with the .pbix format. For the best user experience, consider adding Hints and Tips for using the Visual to the sample file. |
|13.3|Your custom visual must support Power BI Desktop, Power BI Online, Power BI mobile apps, and Power BI Windows universal apps. It must be compatible with Windows 10 and all versions of Internet Explorer 11 and later, and the latest versions of Microsoft Edge, Chrome, Firefox, and Safari (Mac OS). |
|13.4|Your custom visual must support the core functions of Power BI including, but not limited to:<br/><br/>Pinning to dashboard<br/>Filtering<br/>Focus mode<br/>Formatting<br/>Various data types|

## 14. Microsoft Teams apps
<a name="bk_14"> </a>

|Policy number|Description|
|:-----|:-----|
|14.1|Your Microsoft Teams app must be free.|
|14.2|For bots, your bot may not transmit financial instrument details through the user to bot interface. Your bot may transmit links to secure payment services to users; however, you must disclose this in your app’s terms of use and privacy policy (and any profile page or website for the app) before a user agrees to use your bot.|
|14.3|Your Microsoft Teams app must not launch functionality outside of the Microsoft Teams app experience without the explicit permission of the user.|
|14.4|Deleted.|
|14.5|Microsoft Teams apps must respond in a reasonable timeframe.|
|14.5.1|For tabs, if a response to an action takes more than three seconds, you must provide a loading message or warning.|
|14.5.2|For bots, a response to a user command must occur within two seconds. If longer processing is required, you must use a typing indicator.|
|14.5.3|For compose extensions, a response to a user command must occur within five seconds.|
|14.6|Your Microsoft Teams app must be fully functional on the following operating systems and browsers:<br/><br/>Window 7 and later<br/>Mac 10.10 and later<br/>Microsoft Edge 12 and later<br/>Internet Explorer 11 and later<br/>Firefox 47.0 and later<br/>Chrome 51.0 and later<br/><br/>Your bot experience must be fully function on iOS (9.0 and later), Android (4.4 and later), and Windows Phone (10.0.10586 and later).|
|14.7|You must submit a Terms of Service link.|
|14.8|For bots and compose extensions, you will need to ensure that you follow the privacy notice requirements as communicated in the [Developer Code of Conduct for the Microsoft Bot Framework](https://aka.ms/bf-conduct).|
|14.9|Your bot and compose extension must operate in accordance with the requirements set forth in the [Microsoft Bot Framework Online Services Agreement](https://www.botframework.com/Content/Microsoft-Bot-Framework-Preview-Online-Services-Agreement.htm) and [Developer Code of Conduct for the Microsoft Bot Framework](https://aka.ms/bf-conduct).|
|14.10|Your Microsoft Team app’s package must be correctly formatted and conform to the latest manifest schema. This is currently manifest schema version 1.0.|
|14.11|For bots, all manifest information must be consistent with your bot’s Bot Framework metadata: bot name, logo, privacy link, and terms of service link.|
|14.12|Your Microsoft Teams app name may not include "app", "plug-in", or derivatives.|
|14.13|The UI (buttons, links, text fields) of your Microsoft Teams app must be intuitive and obvious in their purpose. Users must not be required to read support content to perform basic operations.|
|14.14|Microsoft's review and publication of your Microsoft Teams app to the Microsoft Teams gallery is not an endorsement of your Microsoft Teams app.|
|14.15|Microsoft Teams apps can fail validation for issues related to [Microsoft Teams app design guidelines](http://aka.ms/microsoftteamsdesignguidelines) or issues that impede the customer experience within Microsoft Teams. To pass validation, Microsoft Teams apps must meet the following requirements:<br/><ul><li>A tab experience must provide value beyond simply hosting an existing website.</li><li>Content in a channel tab must be contextually the same for all members of the channel and not scoped for individual use.</li><li>Content in a tab should not have excessive chrome or layered navigation.</li><li>A configurable tab should not allow users to navigate outside the core experience within the same tab.</li><li>The configuration screen of a configurable tab must clearly explain the value of the experience and how to configure it.</li><li>Tab configuration must happen in the configuration screen.</li><li>Bots must be responsive and fail gracefully.</li></ul>|
|14.16|Microsoft Teams apps must focus on the Microsoft Teams experience and should not include names, icons, or imagery of other similar chat-based collaboration platforms or services unless the apps provide specific interoperability.|


## Conclusion
<a name="bk_conclusion"> </a>

As these requirements evolve, we will continue to update our documentation. Stable requirements are critical to your doing your best work, so we aim to ensure the changes we do make are sustainable and continue to protect and enhance your add-ins.
 

 
Thank you again for joining us in this commitment to delivering fantastic experiences.
 

 

## Validation policy change list
<a name="bk_conclusion"> </a>



|**Version**|**Last modified**|**Description**|
|:-----|:-----|:-----|
|2.2|August 9,2017|Updated policy 10.8 to apply to Office for Android, and added policy 10.8.2.|
|2.2|August 4, 2017|Added policies 14.15 and 14.16.|
|2.2|July 21, 2017|Added policy 7.19.|
|2.2|July 7, 2017|Removed policy 14.4. Updated policies 14.5, 14.6, 14.8, and 14.9.|
|2.2|May 4, 2017|Added section 14 for Microsoft Teams apps.|
|2.1|February 15, 2017|Updated policy 4.12.1 for Outlook add-ins.|
|2.1|February 8, 2017|Added section 13 for Power BI custom visuals.|
|2.0|January 23, 2017|Updated policies 4.12.2 and 4.12.3.|
|2.0|January 17, 2017|Clarified policy 5.8.|
|2.0|January 9, 2017|Updated policy 4.12.1 to state that add-in commands are required for Word, Excel, and PowerPoint add-ins that use the taskpane manifest, effective Feb 1, 2017.|
|2.0|November 30, 2016|Added new validation policies for apps and add-ins that target larger organizations or enterprises: 7.4.5, 11.2.1, 11.3.1|
|1.9|April 19, 2016|Updated policies 4.12, 5.9, and 7.3. Added policies 7.4, 11.3, 11.4.|

## Additional resources
<a name="bk_addresources"> </a>


-  [Use the Seller Dashboard to submit to the Office Store](use-the-seller-dashboard-to-submit-to-the-office-store.md)
-  [Office Store submission FAQ](office-store-submission-faq.md)
-  [Create effective Office Store listings](create-effective-office-store-listings.md)
-  [Office Store Application Provider Agreement](https://sellerdashboard.microsoft.com/Assets/Content/Agreements/en-US/Office_Store_Seller_Agreement_20120927.md)


    
 
