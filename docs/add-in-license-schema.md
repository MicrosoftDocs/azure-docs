# Office and SharePoint Add-in license XML schema structure

If your add-in includes license validation checks, use this schema to create test licenses to test the license validation code in your add-in. For more information, see  [Add license checks to Office and SharePoint Add-ins](add-license-checks-to-office-and-sharepoint-add-ins.md).

Use the  [VerifyEntitlementToken](https://msdn.microsoft.com/en-us/library/office/verificationsvc.verificationserviceclient.verifyentitlementtoken.aspx) method of the Office Store verification web service to determine if an add-in license is valid. The [VerifyEntitlementToken](https://msdn.microsoft.com/en-us/library/office/verificationsvc.verificationserviceclient.verifyentitlementtoken.aspx) method takes a add-in license token as a parameter, and returns an [VerifyEntitlementTokenResponse](https://msdn.microsoft.com/en-us/library/office/verificationsvc.verifyentitlementtokenresponse.aspx) that contains the license token properties, including whether or not the license token is valid.

To support add-in license testing, the Office Store verification web service does not validate the encryption token or any of the attribute values of license tokens where the test attribute is set to  **true**. However, the service does interpret the token, and all the properties of the  [VerifyEntitlementTokenResponse](https://msdn.microsoft.com/en-us/library/office/verificationsvc.verifyentitlementtokenresponse.aspx) object returned by the service can be read.

```xml
<r>
  <t 
    aid="{2[A-Z] 8-12[0-9]}" 
    pid="{GUID}" | "string" 
    cid="{16[0-H]}" 
    oid="{GUID}"
    did="{GUID}" 
    ts="Integer" 
    et="Free" |"Trial" | "Paid"
    sl="true | 1" | "false| 0"
    ad="UTC" 
    ed="UTC" 
    sd="UTC" 
    te="UTC" 
    test="true | 1" | "false | 0"
    ss="0" | "1" | "2" | "3" | "4" />
  <d>VNNAnf36IrkyUVZlihQJNdUUZl/YFEfJOeldWBtd3IM=</d>
</r>
```

## Elements

**r**

Required. The root element.
 
**t**

Required. Contains attributes that represent various properties of the add-in license.

### Attributes

<table>
<tr>
<th>Attribute</th>
<th>Description</th>
</tr>
<tr>
<td>aid</td>
<td>Required text. The asset ID assigned to this add-in by the Office Store.</td>
</tr>
<tr>
<td>pid</td>
<td>Required text. The GUID that represents the product ID of the add-in.<br/>The product ID of the add-in is specified in the add-in manifest.</td>
</tr>
<tr>
<td>cid</td>
<td>Optional text. Represents the purchaser ID when the user is signed in with a Microsoft account. This is an encrypted value of the Microsoft account used by the purchaser of the add-in. If the user is signed in with an organizational identity, this value will be empty.</td>
</tr>
<tr>
<td>oid</td>
<td>Optional text. Represents the purchaser ID when the user is signed in with an organizational identity. This is an encrypted value of the organizational account used by the purchaser of the add-in. If the user is signed in with a Microsoft account, this field will not be present.</td>
</tr>
<tr>
<td>did</td>
<td><strong>For content and task pane Office Add-ins:</strong><br/>
This attribute does not apply to content and task pane Office Add-ins. <strong>For Outlook Add-ins:</strong><br/>
String that represents the deployment ID of the Exchange deployment to which this add-in license applies. This value should be set to the primary authoritative domain for the Exchange deployment.<br/>
<strong>For SharePoint Add-ins:</strong><br/> 
GUID that represents the deployment ID of the SharePoint deployment to which this add-in license applies.<br/>
For test licenses for SharePoint Add-ins, you don't need to specify the deployment ID in the add-in license XML. The ImportAppLicense method supplies the correct deployment ID to the license token XML.</td>
</tr>
<tr>
<td>ts</td>
<td>Integer representing the total number of users licensed to access this add-in, by this purchaser.<br/>
For add-ins that are site licensed, this value is 0.<br/>
This attribute does not apply to Office Add-ins.</td>
</tr>
<tr>
<td>et</td>
<td>Required text. Enumeration that represents the type of add-in license.<br/>
Valid values include Free, Paid, and Trial.</td>
</tr>
<tr>
<td>ad</td>
<td>Required text. UTC time-date stamp that represents the acquisition date for the add-in license.</td>
</tr>
<tr>
<td>sl</td>
<td>Boolean value that represents whether the add-in license is a site license.<br/>
<strong>For content and task pane Office Add-ins:</strong><br/>
This attribute does not apply to content and task pane Office Add-ins.<br/>
<strong>For Outlook Add-ins:</strong><br/>
This attribute is optional for add-in licenses that are not site licenses. This attribute is required to be equal to true if the Outlook add-in is site licensed.<br/>
<strong>For SharePoint Add-ins:</strong><br/>
This attribute is optional for add-in licenses that are not site licenses.</td>
</tr>
<tr>
<td>ed</td>
<td>Optional text. UTC time-date stamp that represents the expiration date for the add-in license.<br/>
This value can be used to check if the trial license is expired.</td>
</tr>
<tr>
<td>sd</td>
<td>Required text. UTC time-date stamp that represents one of the following:
<ul><li>The initial purchase of the license.</li><li>The latest manual license recovery time, if the purchaser has performed such a recovery using their Microsoft account.</li></ul></td>
</tr>
<tr>
<td>te</td>
<td>Required text. UTC time-date stamp that represents the date the current add-in license token expires.</td>
</tr>
<tr>
<td>test</td>
<td>Optional Boolean value. Represents whether the add-in license is a test license.</td>
</tr>
<tr>
<td>ss</td>
<td>Optional integer. Represents the subscription status of the add-in license. This attribute is optional for add-ins that are not being sold as subscriptions.<br/>
This attribute accepts integers from 0 through 4. Valid values include:
<table><tr><th>Integer</th><th>Description</th></tr>
<tr>
<td>0</td>
<td>NotApplicable<br/>
The add-in license is not for a subscription add-in.</td>
</tr>
<tr>
<td>1</td>
<td>Active
The add-in license subscription is currently paid for.<br/>
Recommended user experience: <br/>
Full add-in experience.</td>
</tr>
<tr>
<td>2</td>
<td>FailedPayment<br/>
The automatic monthly billing for the add-in license subscription has failed.<br/>
There are several reasons payment may have failed. For example, the credit card being billed might have expired. When payment fails, emails are sent to the Microsoft account paying for the add-in license. However, the user might not check their Microsoft account email on a frequent basis, or, in the case of SharePoint Add-ins, the person paying for the add-in license may not actually be the person using the add-in license.<br/>
Recommended user experience: <br/>
Present UI in your add-in alerting the user of the problem with billing, so that they can resolve it.</td>
</tr>
<tr>
<td>3</td>
<td>Canceled<br/>
The add-in license subscription has been canceled, and final monthly billing period the user has paid for has expired. <br/>
Recommended user experience: <br/>
Present the user with information that their subscription has been cancelled. Provide information about your add-in, along with a hyperlink to your app’s Office Store listing page, so they are encouraged to renew their subscription. </td>
</tr>
<tr>
<td>4</td>
<td>DelayedCancel<br/>
The add-in license subscription has been canceled, but the subscription is still within the current, monthly billing period the user has paid for. Once the current, paid monthly billing period expires, the subscription status changes to Canceled.<br/>
Recommended user experience: <br/>
Full add-in experience. Additionally, you may want to present contextual UI to ask the user for feedback on why they are canceling their subscription, or to enourage them to re-subscribe.</td>
</tr>
</table>
</td></tr>
</table>

**d**

Required. Encryption token used by the Office Store verification service to determine whether the add-in license token is valid. This is an encrypted signature derived from the literal string contained in the `<t>` element.
 
When you submit a test add-in license token to the Office Store verification web service, the service does not perform that validation check of comparing the encrypted signature in the `<d>` element to the string contained in the `<t>` element.

## Remarks

> [!IMPORTANT]
> When your add-in receives an add-in license token from its hosting environment, be it an Office application or SharePoint, developers are advised not to parse or otherwise manipulate the add-in license token string before passing it to the Office Store verification web service for verification. While the add-in license token is structured as an XML fragment, for purposes of validation the Office Store verification web service treats the token as a literal string. 

> The Office Store verification web service compares the contents of the `<t>` element to the value of the `<d>` element, which is an encrypted signature derived from the literal string contained in the `<t>` element. Any reformatting of the license token, such as adding white space, tabs, line breaks, etc., will change the literal value of the `<t>` element and therefore cause the license verification check to fail.

> When you submit a test add-in license token to the Office Store verification web service, the service does not perform that validation check of comparing the encrypted signature in the `<d>` element to the string contained in the `<t>` element. This enables developers to create their own test add-in license tokens for testing purposes without worrying about formatting, or generating the encryption signature for the `<d>` element.

## Example: Add-in license XML for a SharePoint Add-in
<a name="SP15applicense_example"> </a>

The following example shows the add-in license XML for a SharePoint Add-in, representing a trial add-in for which the purchaser has acquired 30 seats. The user is signed in with their Microsoft account.

```xml
<r>
  <t 
    aid="WA900006056" 
    pid="{4FB601F2-5469-4542-B9FC-B96345DC8B39}" 
    cid="32F3E7FC559F4F49" 
    did="{0672BAE9-B41B-48FE-87F1-7F4D3DD3F3B1}" 
    ts="30" 
    et="Trial" 
    ad="2012-01-12T21:58:13Z" 
    ed="2012-06-30T21:58:13Z" 
    sd="2012-01-12T00:00:00Z" 
    te="2012-06-30T02:49:34Z" />
  <d>VNNAnf36IrkyUVZlihQJNdUUZl/YFEfJOeldWBtd3IM=</d>
</r>
```

The following example shows the add-in license for a user who is signed in with their organizational identity. Note that the  **cid** attribute is empty.

```xml
<r>
   <t 
     aid="WA104104476" 
     pid="b1485f0b-1807-495b-bf21-c58a82619ac5" 
     cid="" 
     oid="cc2f0903-8765-48a3-9307-92d84829a42f" 
     ts="0" 
     sl="true" 
     et="Free" 
     ad="2015-10-21T13:40:47Z" 
     sd="2015-10-21" 
     te="2016-10-20T13:40:47Z" 
     ss="0" />
     <d>Ymwiorz9SdzbkYrJnYwRzU/Q6zwFyiuXMkJztKCtmQE=</d>
</r>
```

## Additional resources
<a name="SP15applicenseschema_addlresources"> </a>

- [How licenses work for Office and SharePoint Add-ins](how-licenses-work.md)
- [Add license checks to Office and SharePoint Add-ins](add-license-checks-to-office-and-sharepoint-add-ins.md)
- [Implement licensing to upsell your Office Add-in services](implement-licensing-for-add-in-services.md)
- [Decide on a pricing model for your Office Store submission](decide-on-a-pricing-model.md)
- [VerificationSvc namespace](https://msdn.microsoft.com/en-us/library/verificationsvc.aspx)
- [License your Office and SharePoint Add-ins](license-your-add-ins.md)
- [Submit your solutions to the Office Store](submit-to-the-office-store.md)



