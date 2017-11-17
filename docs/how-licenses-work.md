# How licenses work for Office and SharePoint Add-ins 

The licensing framework for Office and SharePoint Add-ins gives you a way to include code in your add-ins to verify and enforce their legal use. You can restrict access to your add-ins to only those users who have a valid license, or specify which features are available, how the add-in behaves, or other logic, based on the properties of that license. To write effective license checks, it is important to understand the types of licenses that are available, how users acquire licenses, and how licenses work in terms of duration and scope.
 

The add-in license itself is a digital set of  *verifiable information*  stating usage rights of an Office or SharePoint Add-in:
 

- The information is verifiable in that you can query the Office Store to check on an add-in license validity.
    
 
- These usage rights include whether an add-in is for purchase or free, whether the add-in is available on a per-user or site basis, and whether the add-in is a trial or full version.
    
 
To include code in your add-ins that performs licensing checks, see [License your Office and SharePoint Add-ins](license-your-add-ins.md).
 

## Types of add-in licenses
<a name="bk_what"> </a>

The add-in license categories used by the Office Store are based on how or whether you pay for them, and on their scope. Payment categories include: Free, Paid (with or without a trial offer), and Subscription (again, with or without a trial offer). Scope categories include Per-User or Site. 
 

- Task pane and content add-ins can be Free, Paid, or Subscription priced, and are offered on a Per-User basis only.
    
    > [!IMPORTANT]
    > To help you maximize reach and adoption, task pane and content add-ins allow anonymous access. Users don't have to sign in to Office with their Microsoft account to activate Office Add-ins. By default, if your task pane or content add-in does not implement licensing checks, it will present the same UI and functionality to anonymous users as it does to licensed users. For more information, see [Add-in license tokens and anonymous access for Office Add-ins](license-your-add-ins.md#bk_anonymous).

- Outlook add-ins can be Free, Paid, or Subscription priced, and offered on a Per-User or Site basis. Outlook add-ins bought on a Per-User basis apply only to the person who bought them. Only administrators can buy add-ins on a site license basis and make them available to all users in their organization. 
    
 
- SharePoint Add-ins can be Free, Paid, or Subscription priced, and offered on a Per-User or Site basis.
    
    > [!NOTE]
    > SharePoint 2013 does not support subscription licensing.
     
SharePoint 2013 maps the license categories used by the Office Store to add-in license types, based on user access. The following table shows how the SharePoint add-in license types map to the classifications used by the Office Store.
 

 


|**SharePoint license type**|**Office Store license category**|**License applies to**|**Duration**|**Users**|**Cost**|
|:-----|:-----|:-----|:-----|:-----|:-----|
|Perpetual all user|Free PaidSite|All users of a SharePoint deployment, with no expiration.|Perpetual|Unlimited|Free or paid|
|Perpetual multiuser|Paid|Per user, with no expiration.|Perpetual|N (per user)|Paid|
|Trial all user|Trial|All users of a SharePoint deployment. Can have a set expiration date.|15, 30, 60 days, or unlimited|Unlimited|Free|
|Trial multiuser|Trial|Per user. Can have a set expiration date.|15, 30, 60 days, or unlimited|N (per user)|Free|

## How users acquire add-in licenses
<a name="bk_users"> </a>

When a user acquires an add-in — either paid, free, or as a trial — that user is also acquiring the add-in's license. 
 

 
To get an add-in, a user browses the Office Store, selects the add-in, and then logs on to the Office Store using their Microsoft account. When the purchaser gets the add-in — whether for free, payment, or as a trial — the Office Store generates the appropriate add-in license and downloads a token that represents the license to the purchaser's environment. 
 

 

- For content and task pane add-ins, the Office Store downloads the license token and stores it in the purchaser's Office client application. The purchaser can then access and use the add-in.
    
    Task pane and content add-ins allow anonymous access. For more information, see [Add-in license tokens and anonymous access](license-your-add-ins.md#bk_anonymous).
    
 
- Outlook add-in license tokens are downloaded to the appropriate Exchange mailbox. For Outlook add-ins with a per-user license, the token is downloaded to the user's personal mailbox. For Outlook add-ins with a site license, the token is downloaded to a special organization mailbox for the Exchange deployment.
    
    For Outlook add-ins offered for free or as unlimited trials, no license is generated or stored by the Office Store, and no license token is downloaded to Exchange.
    
 
- For SharePoint Add-ins, the license token is downloaded and stored in the purchaser's SharePoint deployment.
    
    For SharePoint Add-ins, only site, tenant, or farm administrators can purchase add-in licenses, because only users with those roles have sufficient privileges to install an add-in in a site. Therefore, in many cases, the person acquiring the add-in is an administrator or purchasing agent, not the person who will actually use it.
    
    The add-in's purchaser can then manage the license, assign those licenses to other users within their deployment, and enable other users to manage the licenses. A user who is assigned an add-in license can access and use the add-in.
    
 
The Office Store retains a record of each add-in license for verification and disaster recovery purposes.
 

 
 **Acquiring an add-in license from the Office Store**
 

 
The following figure shows the add-in license acquisition process for content and task pane Office Add-ins when the add-in is acquired directly from the Office Store. When the user acquires the add-in, the Office Store generates an add-in license, which it retains, and downloads a corresponding add-in license token to the Office application. The user can then access the add-in.
 
![App purchase process from Office Store](/images/sp15-add-in-license-purchase-office.png)
 

### Acquiring an add-in license from an add-in catalog

 
The following figure shows the add-in license acquisition process for Office Add-ins; this time the user acquires the add-in from an add-in catalog hosted on SharePoint 2013. When the user acquires the add-in, the add-in catalog contacts the Office Store for the appropriate add-in license. The Office Store generates the add-in license, which it retains, and returns a corresponding add-in license token, which the add-in catalog downloads to the Office application. The user can then access the add-in.

![Office app purchase process from corporate catalog](/images/office15-add-in-license-purchase-corp-catalog.png)
 

### Acquiring an add-in license for an Outlook add-in
 
The following figure shows the add-in license acquisition process for Outlook add-ins when the add-in is acquired directly from the Office Store. When the user acquires the add-in, the Office Store generates an add-in license, which it retains, and downloads a corresponding add-in license token to the user's Exchange deployment. For Outlook add-ins with a per-user license, the token is downloaded to the personal mailbox of the person acquiring the add-in. For Outlook add-ins with a site license, the token is downloaded to the organization mailbox of the Exchange deployment. For Outlook add-ins offered for free or as unlimited trials, no license is generated or stored by the Office Store, and so no license token is downloaded to Exchange. The user can then use the add-in.

 
![Mail app purchase from the Office Store](/images/office15-add-in-license-purchase-mail.png)
 

### Acquiring an add-in license for a SharePoint Add-in
 
 
The following figure shows the add-in license acquisition and assignment process for SharePoint Add-ins. A user, who might or might not be one of the people who will use the add-in, acquires the add-in, either directly from the Office Store or from a SharePoint add-in catalog. The Office Store generates the appropriate add-in license, which it contains, and downloads a corresponding add-in license token to the SharePoint deployment from which the add-in was acquired. The user can then manage and assign the license to one or more users, based on the license type.
 
 
![SharePoint app purchase from Office Store](/images/sp15-add-in-license-purchase-sharepoint.png)
 


## Add-in license tokens, duration, and scope
<a name="bk_details"> </a>

Add-in licenses vary in duration, depending on their type. Also, add-in licenses for Office Add-ins differ from licenses for SharePoint Add-ins in terms of their  *scope*  , or where users can access them. Understanding these and other details of how add-in licenses operate will help you write more effective license checks.
 

 

### Add-in license duration and token expiration

When you acquire an add-in license from the Office Store, the Office Store downloads a version of that add-in license—an  *add-in license token*  —to your SharePoint installation, Exchange deployment, or Office application, as applicable. For security reasons, add-in license tokens expire and must be renewed periodically.
 

 
The expiration of the add-in license, stored in the Office Store, is determined by the terms of the add-in acquisition. For example, add-ins with a perpetual license type do not expire. Trial add-ins, however, do expire if they have a specified expiration date. 
 

 

- For content and task pane Office Add-ins, the Office application checks the license token each time the user launches the add-in, and renews the token if needed.
    
 
- For Outlook add-ins, Exchange checks the license token each time Outlook loads the add-in manifest from Exchange, and renews the token if needed. Outlook loads the add-in manifests each time the user logs into Outlook.
    
 
- For SharePoint Add-ins, the license token is renewed by SharePoint as part of a preset timer job. Users can also manually renew an add-in license, for example, as part of a disaster recovery scenario.
    
 

### License scope in content and task pane add-ins

Each add-in license applies to the specific user, for that specific add-in. For Office Add-ins, this means that a licensed user can access and use the add-in in any Office application instance that it applies to. For example, the user can use the add-in across multiple computers, each with a separate instance of the applicable Office application installed. When a user launches an Office application, and signs in with their Microsoft account, the Office application queries the Office Store for a list of the add-ins that user is licensed to use.
 

 

### License scope in Outlook add-ins

For Outlook add-ins, each add-in license applies to a specific add-in for a specific Exchange  *deployment*  . An Outlook add-in with a site license is available to everyone in the same Exchange deployment as the administrator who acquired it.
 

 
For Outlook add-in licenses, the deployment ID is the primary authoritative mail domain for the Exchange deployment. For example, "CONTSO.COM". This deployment ID string is included in each add-in license token, and enforced in Exchange when add-ins are installed or loaded to Outlook. Exchange inspects the license token and verifies that the deployment ID matches the organization of the user. If it does not match, then Exchange blocks the add-in.
 

 

### License scope and the deployment ID for SharePoint Add-ins

For SharePoint Add-ins, each add-in license applies to a specific add-in for a specific SharePoint  *deployment*  . A user with a license for an add-in can use that add-in on any site for that particular SharePoint deployment. In general, for the purpose of add-in licenses, *deployment*  is defined as the SharePoint farm for on-premises SharePoint installations, and the tenancy for SharePoint Online in Office 365.
 

 
Deployment scope can vary, however, based on the configuration of the on-premises SharePoint installation. Add-in license tokens are stored in the Add-in Management Shared Service; therefore, the actual scope of an add-in license is determined by the configuration of the Add-in Management Shared Service. A given SharePoint installation could contain multiple web applications using different instances of the Add-in Management Shared Service, and possibly using a federated service. In addition, an on-premises SharePoint installation might be configured for multitenancy, is which case a single instance of the Add-in Management Shared Service might have multiple deployment IDs.
 

 
The deployment ID of the SharePoint installation to which an add-in license applies is included in each add-in license. The deployment ID is a GUID generated by SharePoint and recorded by the Office Store the first time anyone from a specific SharePoint installation visits the Office Store site.
 

 
For on-premises SharePoint installations, you can set the deployment ID via Windows PowerShell, for disaster recovery or test/production environment scenarios. 
 

 

### Add-in license assignment for SharePoint Add-ins

For SharePoint Add-ins that have a per-user license, each add-in license can be assigned to the specified number of SharePoint users. The add-in license applies only to the specified SharePoint deployment and the specified users.
 

 
For add-ins with a site license, that license is assigned to all users on that deployment automatically. The purchaser of the add-in license can use the SharePoint user interface to manage the add-in licenses he or she acquired, including assigning licenses to users and designating other users who can manage the add-in licenses. You cannot programmatically assign add-in licenses.
 

 

## Best practices for add-in license checks
<a name="bk_details"> </a>

Apply the following best practices when you create and enforce add-in licenses and restrictions.

<table>
<tr>
<th>Best practice</th>
<th>Description</th>
</tr>
<tr>
<td>Minimize access to code that performs add-in license checks.</td>
<td>For security reasons, we strongly recommended that you place the code that performs the license check somewhere outside the reach of potential tampering. For example, you can limit your add-in's security exposure by using server-side code to query the Office Store verification web service, instead of performing the license check client-side.<br /><ul><li>For Office Add-ins, you are required to use server-side code to query the Office Store verification web service. </li><li>For SharePoint Add-ins, if you are hosting your add-in pages on SharePoint, you can use the SharePoint web proxy to make JavaScript calls to the Office Store verification service. However, for security reasons we strongly recommend that you only use server-side code to query the Office Store verification web service.</li></ul></td></tr>
<tr>
<td>Add license checks only as needed.</td>
<td>Add license checks only at those points in your add-in where you want to take some action based on whether the user has a valid license or other license information. For example, when the user launches the add-in, or when the user attempts to access certain add-in features that you want to control based on add-in license information.<br /><br />For SharePoint Add-ins, do not perform add-in license checks on every page of your add-in. Constant querying of the SharePoint deployment for the add-in license token is rarely necessary, and can lead to your add-in performance being throttled.</td>
</tr>
<tr>
<td>Cache the license check appropriately.</td>
<td>For add-ins with a perpetual unlimited user license, cache until the license token expires. For add-ins with a multiuser license, either trial or perpetual, cache per session because user assignment can change.<br /><br />Make sure the production version of your add-in does not accept test licenses.<br /><br />When you finish testing your add-in and are ready to move it to production, make sure you add code to the license checks in your add-in so that the add-in no longer accepts test licenses. After you pass the add-in license token to the verification service's <a href="https://msdn.microsoft.com/en-us/library/office/verificationsvc.verificationserviceclient.verifyentitlementtoken.aspx">VerifyEntitlementToken</a> method, you can use the <a href="https://msdn.microsoft.com/en-us/library/office/verificationsvc.verifyentitlementtokenresponse.aspx">VerifyEntitlementTokenResponse</a> object returned by that method to access the add-in license properties. For test add-in licenses, the <a href="https://msdn.microsoft.com/en-us/library/office/verificationsvc.verifyentitlementtokenresponse.istest.aspx">IsTest</a> property returns <strong>true</strong> and the <a href="https://msdn.microsoft.com/en-us/library/office/verificationsvc.verifyentitlementtokenresponse.isvalid.aspx">IsValid</a> property returns <strong>false</strong>.</td>
</tr>
</table>


## Additional resources
<a name="bk_resources"> </a>

-  [License your Office and SharePoint Add-ins](license-your-add-ins.md) 
-  [Add license checks to Office and SharePoint Add-ins](add-license-checks-to-office-and-sharepoint-add-ins.md)
-  [SharePoint 2013 code sample: Import, validate, and manage add-in licenses](http://code.msdn.microsoft.com/SharePoint-2013-Import-f5f680a6)
-  [Decide on a pricing model for your Office or SharePoint Add-in or Office 365 web app](decide-on-a-pricing-model.md)
-  [Office and SharePoint Add-in license XML schema structure](add-in-license-schema.md)
-  [VerificationSvc](https://msdn.microsoft.com/en-us/library/verificationsvc.aspx)
    
