# Display Widgets

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

The **Display Widget** is a group of user interface elements that has special functionality and interacts with Azure Active Directory B2C backend service. It allows the user to perform certain actions on the page, which invokes certain [validation technical profiles](validation-technical-profile.md) at the backend. **Display Widgets** are displayed on the page and are referenced in [Self Asserted Technical Profile](self-asserted-technical-profile.md). Following example illustrates a self-asserted sign-up page with two display widget that validate the email address and the alternative (secondary) email address.

![Display widget](media/display-widget-email.png)

## Prerequisites

 In the [Metadata](self-asserted-technical-profile.md#metadata) section of [Self Asserted Technical Profile](self-asserted-technical-profile.md), the referenced [Content Definition](contentdefinitions.md) needs to have DataUri set to a page contract version 2.0.0 or higher. For example:

```XML
<ContentDefinition Id="api.selfasserted">
  <LoadUri>~/tenant/default/selfAsserted.cshtml</LoadUri>
  <RecoveryUri>~/common/default_page_error.html</RecoveryUri>
  <DataUri>urn:com:microsoft:aad:b2c:elements:selfasserted:2.0.0</DataUri>
  ...
```

## Defining Display Widgets
The **DisplayWidget** element contains the following attribute:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| Id | Yes | An identifier that's used for the display widget. It can be [referenced](#referencing-display-widgets). |
| UserInterfaceWidgetType | Yes | The type of the display widget. Currently supported is [VerificationWidget](display-widget-verification) |

The **DisplayWidget** element contains the following elements:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| InputClaims | 0:1 | The **InputClaims** are used to prepopulate the value of the claims to be collected from the user. |
| DisplayClaims | 0:1 | The **DisplayClaims** are used to represent claims to be collected from the user. |
| OutputClaims | 0:1 | The **OutputClaims** are used to represent claims to be saved temporarily for this **display widget**. |
| Actions | 0:1 | The **Actions** are used to list the validation technical profiles to invoke for user actions happening at the front-end. |

### Input claims
In a display widget, you can use **InputClaims** elements to prepopulate the value of claims to collect from the user on the page. Any **InputClaimsTransformations** can be defined in the self asserted technical profile which references this display widget.

In the example below, you can prepopulate the email address to be verified with the one already present.

```XML
<DisplayWidget Id="emailWidget" UserInterfaceWidgetType="VerificationWidget">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="emailAddress" />
  </InputClaims>
  ...
```
### Display claims
Similar to the **display claims** defined in [self-asserted technical profile](self-asserted-technical-profile.md#display-claims), the display claims are representing the claims to be collected from the user within this display widget. The **ClaimType** element referenced needs to set the **UserInputType** element to any user input type supported by Azure AD B2C, such as `TextBox` or `DropdownSingleSelect`. If a display claim value is required by an **Action**, set the **Required** attribute to `true` to force the user to provide a value for that specific display claim.

Certain display claims are required for certain types of display widget. For example, **VerificationCode** is required for the display widget of type **VerificationWidget**. Use the attribute **ControlClaimType** to specify which DisplayClaim is designated for that required claim. For example:

```XML
<DisplayClaim ClaimTypeReferenceId="otpCode" ControlClaimType="VerificationCode" Required="true" />
```

### Output claims

The **output claims** of a display widget are not outputted to the next orchestration step but only saved temporarily for the current display widget session. Those can be temporary claims to be shared between different action of the same display widget.

To bubble up the output the claims to the next orchestration step, use the **OutputClaims** of the actual self-asserted technical profile which references this display widget.

### Display Widget Actions

The **Actions** of a display widget are procedures happening at the backend when a user performs certain action in the client side  (the browser). For example, what validations to perform when the user clicks a button on the page. Each type of **display widget** requires different set of display claims, output claims and actions to be performed.

An action defines a list of **validation technical profiles**. They are used for validating some or all of the display claims of the display widget. The validation technical profile validates the user input and may return an error to the user. You can use **ContinueOnError**, **ContinueOnSuccess** and **Preconditions** in the display widget Action similarly to how they are used in the [validation technical profiles](validation-technical-profile.md) in the self asserted technical profile. 

In the example below, it will send a code in either email or SMS based on user selection on **mfaType** claim.

```XML
<Action Id="SendCode">
  <ValidationClaimsExchange>
    <ValidationClaimsExchangeTechnicalProfile TechnicalProfileReferenceId="AzureMfa-SendSms">
      <Preconditions>
        <Precondition Type="ClaimEquals" ExecuteActionsIf="true">
          <Value>mfaType</Value>
          <Value>email</Value>
          <Action>SkipThisValidationTechnicalProfile</Action>
        </Precondition>
      </Preconditions>
    </ValidationClaimsExchangeTechnicalProfile>
    <ValidationClaimsExchangeTechnicalProfile TechnicalProfileReferenceId="AadSspr-SendEmail">
      <Preconditions>
        <Precondition Type="ClaimEquals" ExecuteActionsIf="true">
          <Value>mfaType</Value>
          <Value>phone</Value>
          <Action>SkipThisValidationTechnicalProfile</Action>
        </Precondition>
      </Preconditions>
    </ValidationClaimsExchangeTechnicalProfile>
  </ValidationClaimsExchange>
</Action>
```

## Referencing display widgets

Display widgets are referenced in the [display claims](self-asserted-technical-profile.md#display-claims) of the [self asserted technical profile](self-asserted-technical-profile.md). For example:

```XML
<TechnicalProfile Id="SelfAsserted-ProfileUpdate">
  ...
  <DisplayClaims>
    <DisplayClaim DisplayWidgetReferenceId="emailVerificationWidget" />
    <DisplayClaim DisplayWidgetReferenceId="PhoneVerificationWidget" />
    <DisplayClaim ClaimTypeReferenceId="displayName" Required="true" />
    <DisplayClaim ClaimTypeReferenceId="givenName" Required="true" />
    <DisplayClaim ClaimTypeReferenceId="surName" Required="true" />
```