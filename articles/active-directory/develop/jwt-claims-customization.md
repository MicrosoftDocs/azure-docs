---
title: Customize app JSON Web Token (JWT) claims (Preview)
description: Learn how to customize the claims issued by Microsoft identity platform in the JSON web token (JWT) token for enterprise applications.
services: active-directory
author: davidmu1
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: how-to
ms.date: 05/01/2023
ms.author: davidmu
ms.custom: aaddev, curation-claims
ms.reviewer: rahulnagraj, alamaral
---

# Customize claims issued in the JSON web token (JWT) for enterprise applications (Preview)

The Microsoft identity platform supports [single sign-on (SSO)](../manage-apps/what-is-single-sign-on.md) with most preintegrated applications in the Azure Active Directory (Azure AD) application gallery and custom applications. When a user authenticates to an application through the Microsoft identity platform using the OIDC protocol, the Microsoft identity platform sends a token to the application. The application validates and uses the token to sign the user in instead of prompting for a username and password.

These JSON Web tokens (JWT) used by OIDC and OAuth applications (preview) contain pieces of information about the user known as *claims*. A claim is information that an identity provider states about a user inside the token they issue for that user. In an [OIDC response](v2-protocols-oidc.md), claims data is typically contained in the ID Token issued by the identity provider in the form of a JWT.

## View or edit claims

To view or edit the claims issued in the JWT to the application, open the application in Azure portal. Then select **Single sign-on** blade in the left-hand menu and open the **Attributes & Claims** section.

:::image type="content" source="./media/jwt-claims-customization/attributes-claims.png" alt-text="Screenshot of opening the Attributes & Claims section in the Azure portal.":::

An application may need claims customization for various reasons. For example, when an application requires a different set of claim URIs or claim values. Using the **Attributes & Claims** section, you can add or remove a claim for your application. You can also create a custom claim that is specific for an application based on the use case.

The following steps describe how to assign a constant value:

1. In the [Azure portal](https://portal.azure.com/), on the **Attributes & Claims** section, Select **Edit** to edit the claims.
1. Select the required claim that you want to modify.
1. Enter the constant value without quotes in the **Source attribute** as per your organization, and then select **Save**.

:::image type="content" source="./media/jwt-claims-customization/customize-claim.png" alt-text="Screenshot of customizing a claim in the Azure portal.":::

The Attributes overview displays the constant value.

:::image type="content" source="./media/jwt-claims-customization/claims-overview.png" alt-text="Screenshot of displaying claims in the Azure portal.":::

## Special claims transformations

You can use the following special claims transformations functions.

| Function | Description |
|----------|-------------|
| **ExtractMailPrefix()** | Removes the domain suffix from either the email address or the user principal name. This function extracts only the first part of the user name. For example, `joe_smith` instead of `joe_smith@contoso.com`. |
| **ToLower()** | Converts the characters of the selected attribute into lowercase characters. |
| **ToUpper()** | Converts the characters of the selected attribute into uppercase characters. |

## Add application-specific claims

To add application-specific claims:

1. In **User Attributes & Claims**, select **Add new claim** to open the **Manage user claims** page.
1. Enter the **name** of the claims. The value doesn't strictly need to follow a URI pattern. If you need a URI pattern, you can put that in the **Namespace** field.
1. Select the **Source** where the claim is going to retrieve its value. You can select a user attribute from the source attribute dropdown or apply a transformation to the user attribute before emitting it as a claim.

### Claim transformations

To apply a transformation to a user attribute:

1. In **Manage claim**, select *Transformation* as the claim source to open the **Manage transformation** page.
1. Select the function from the transformation dropdown. Depending on the function selected, provide parameters and a constant value to evaluate in the transformation.
1. **Treat source as multivalued** indicates whether the transform is applied to all values or just the first. By default, the first element in a multi-value claim is applied the transformations. When you check this box, it ensures it's applied to all. This checkbox is only enabled for multi-valued attributes. For example, `user.proxyaddresses`.
1. To apply multiple transformations, select **Add transformation**. You can apply a maximum of two transformations to a claim. For example, you could first extract the email prefix of the `user.mail`. Then, make the string upper case.

    :::image type="content" source="./media/jwt-claims-customization/sso-saml-multiple-claims-transformation.png" alt-text="Screenshot of claims transformation.":::

You can use the following functions to transform claims.

| Function | Description |
|----------|-------------|
| **ExtractMailPrefix()** | Removes the domain suffix from either the email address or the user principal name. This function extracts only the first part of the user name. For example, `joe_smith` instead of `joe_smith@contoso.com`. |
| **Join()** | Creates a new value by joining two attributes. Optionally, you can use a separator between the two attributes. For NameID claim transformation, the Join() function has specific behavior when the transformation input has a domain part. It removes the domain part from input before joining it with the separator and the selected parameter. For example, if the input of the transformation is `joe_smith@contoso.com` and the separator is `@` and the parameter is `fabrikam.com`, this input combination results in `joe_smith@fabrikam.com`. |
| **ToLowercase()** | Converts the characters of the selected attribute into lowercase characters. |
| **ToUppercase()** | Converts the characters of the selected attribute into uppercase characters. |
| **Contains()** | Outputs an attribute or constant if the input matches the specified value. Otherwise, you can specify another output if there's no match. <br/>For example, if you want to emit a claim where the value is the user's email address if it contains the domain `@contoso.com`, otherwise you want to output the user principal name. To perform this function, you configure the following values:<br/>*Parameter 1(input)*: user.email<br/>*Value*: "@contoso.com"<br/>Parameter 2 (output): user.email<br/>Parameter 3 (output if there's no match): user.userprincipalname |
| **EndWith()** | Outputs an attribute or constant if the input ends with the specified value. Otherwise, you can specify another output if there's no match.<br/>For example, if you want to emit a claim where the value is the user's employee ID if the employee ID ends with "000", otherwise you want to output an extension attribute. To perform this function, you configure the following values:<br/>*Parameter 1(input)*: user.employeeid<br/>*Value*: "000"<br/>Parameter 2 (output): user.employeeid<br/>Parameter 3 (output if there's no match): user.extensionattribute1 |
| **StartWith()** | Outputs an attribute or constant if the input starts with the specified value. Otherwise, you can specify another output if there's no match.<br/>For example, if you want to emit a claim where the value is the user's employee ID if the country/region starts with "US", otherwise you want to output an extension attribute. To perform this function, you configure the following values:<br/>*Parameter 1(input)*: user.country<br/>*Value*: "US"<br/>Parameter 2 (output): user.employeeid<br/>Parameter 3 (output if there's no match): user.extensionattribute1 |
| **Extract() - After matching** | Returns the substring after it matches the specified value.<br/>For example, if the input's value is `Finance_BSimon`, the matching value is `Finance_`, then the claim's output is `BSimon`. |
| **Extract() - Before matching** | Returns the substring until it matches the specified value.<br/>For example, if the input's value is `BSimon_US`, the matching value is `_US`, then the claim's output is `BSimon`. |
| **Extract() - Between matching** | Returns the substring until it matches the specified value.<br/>For example, if the input's value is `Finance_BSimon_US`, the first matching value is `Finance_`, the second matching value is `_US`, then the claim's output is `BSimon`. |
| **ExtractAlpha() - Prefix** | Returns the prefix alphabetical part of the string.<br/>For example, if the input's value is `BSimon_123`, then it returns `BSimon`. |
| **ExtractAlpha() - Suffix** | Returns the suffix alphabetical part of the string.<br/>For example, if the input's value is `123_Simon`, then it returns `Simon`. |
| **ExtractNumeric() - Prefix** | Returns the prefix numerical part of the string.<br/>For example, if the input's value is `123_BSimon`, then it returns `123`. |
| **ExtractNumeric() - Suffix** | Returns the suffix numerical part of the string.<br/>For example, if the input's value is `BSimon_123`, then it returns `123`. |
| **IfEmpty()** | Outputs an attribute or constant if the input is null or empty.<br/>For example, if you want to output an attribute stored in an extension attribute if the employee ID for a given user is empty. To perform this function, configure the following values:<br/>Parameter 1(input): user.employeeid<br/>Parameter 2 (output): user.extensionattribute1<br/>Parameter 3 (output if there's no match): user.employeeid |
| **IfNotEmpty()** | Outputs an attribute or constant if the input isn't null or empty.<br/>For example, if you want to output an attribute stored in an extension attribute if the employee ID for a given user isn't empty. To perform this function, you configure the following values:<br/>Parameter 1(input): user.employeeid<br/>Parameter 2 (output): user.extensionattribute1 |
| **Substring() - Fixed Length** (Preview)| Extracts parts of a string claim type, beginning at the character at the specified position, and returns the specified number of characters.<br/>SourceClaim - The claim source of the transform that should be executed.<br/>StartIndex - The zero-based starting character position of a substring in this instance.<br/>Length - The length in characters of the substring.<br/>For example:<br/>sourceClaim - PleaseExtractThisNow<br/>StartIndex - 6<br/>Length - 11<br/>Output: ExtractThis |
| **Substring() - EndOfString** (Preview) | Extracts parts of a string claim type, beginning at the character at the specified position, and returns the rest of the claim from the specified start index. <br/>SourceClaim - The claim source of the transform.<br/>StartIndex - The zero-based starting character position of a substring in this instance.<br/>For example:<br/>sourceClaim - PleaseExtractThisNow<br/>StartIndex - 6<br/>Output: ExtractThisNow |
| **RegexReplace()** (Preview) |  RegexReplace() transformation accepts as input parameters:<br/>- Parameter 1: a user attribute as regex input<br/>- An option to trust the source as multivalued<br/>- Regex pattern<br/>- Replacement pattern. The replacement pattern may contain static text format along with a reference that points to regex output groups and more input parameters. |

If you need other transformations, submit your idea in the [feedback forum in Azure AD](https://feedback.azure.com/d365community/forum/22920db1-ad25-ec11-b6e6-000d3a4f0789) under the *SaaS application* category.

## Regex-based claims transformation

The following image shows an example of the first level of transformation:

:::image type="content" source="./media/jwt-claims-customization/regexreplace-transform1.png" alt-text="Screenshot of the first level of transformation.":::

The following table provides information about the first level of transformations. The actions listed in the table correspond to the labels in the previous image. Select **Edit** to open the claims transformation blade.

| Action | Field | Description |
| :----- | :---- | :---------- |
| 1 | `Transformation` | Select the **RegexReplace()** option from the **Transformation** options to use the regex-based claims transformation method for claims transformation. |
| 2 | `Parameter 1` | The input for the regular expression transformation. For example, user.mail that has a user email address such as `admin@fabrikam.com`. |
| 3 | `Treat source as multivalued` | Some input user attributes can be multi-value user attributes. If the selected user attribute supports multiple values and the user wants to use multiple values for the transformation, they need to select **Treat source as multivalued**. If selected, all values are used for the regex match, otherwise only the first value is used. |
| 4 |  `Regex pattern` | A regular expression that is evaluated against the value of user attribute selected as *Parameter 1*. For example, a regular expression to extract the user alias from the user's email address is represented as `(?'domain'^.*?)(?i)(\@fabrikam\.com)$`. |
| 5 | `Add additional parameter` | More than one user attribute can be used for the transformation. The values of the attributes would then be merged with regex transformation output. Up to five more parameters are supported. |
| 6 | `Replacement pattern` | The replacement pattern is the text template, which contains placeholders for regex outcome. All group names must be wrapped inside the curly braces such as {group-name}. Let's say the administration wants to use user alias with some other domain name, for example `xyz.com` and merge country name with it. In this case, the replacement pattern would be `{country}.{domain}@xyz.com`, where `{country}` is the value of input parameter and `{domain}` is the group output from the regular expression evaluation. In such a case, the expected outcome is `US.swmal@xyz.com`. |

The following image shows an example of the second level of transformation:

:::image type="content" source="./media/jwt-claims-customization/regexreplace-transform2.png" alt-text="Screenshot of second level of claims transformation.":::

The following table provides information about the second level of transformations. The actions listed in the table correspond to the labels in the previous image.

| Action | Field | Description |
| :----- | :---- | :---------- |
| 1 | `Transformation` | Regex-based claims transformations aren't limited to the first transformation and can be used as the second level transformation as well. Any other transformation method can be used as the first transformation. |
| 2 | `Parameter 1` | If **RegexReplace()** is selected as a second level transformation, output of first level transformation is used as an input for the second level transformation. To apply the transformation, the second level regex expression should match the output of the first transformation. |
| 3 | `Regex pattern` | **Regex pattern** is the regular expression for the second level transformation. |
| 4 | `Parameter input` | User attribute inputs for the second level transformations. |
| 5 | `Parameter input` | Administrators can delete the selected input parameter if they don't need it anymore. |
| 6 | `Replacement pattern` | The replacement pattern is the text template, which contains placeholders for regex outcome group name, input parameter group name, and static text value. All group names must be wrapped inside the curly braces such as `{group-name}`. Let's say the administration wants to use user alias with some other domain name, for example `xyz.com` and merge country name with it. In this case, the replacement pattern would be `{country}.{domain}@xyz.com`, where `{country}` is the value of input parameter and `{domain}` is the group output from the regular expression evaluation. In such a case, the expected outcome is `US.swmal@xyz.com`. |
| 7 | `Test transformation` | The RegexReplace() transformation is evaluated only if the value of the selected user attribute for *Parameter 1* matches with the regular expression provided in the **Regex pattern** textbox. If they don't match, the default claim value is added to the token. To validate regular expression against the input parameter value, a test experience is available within the transform blade. This test experience operates on dummy values only. When more input parameters are used, the name of the parameter is added to the test result instead of the actual value. To access the test section, select **Test transformation**. |

The following image shows an example of testing the transformations:

:::image type="content" source="./media/jwt-claims-customization/regexreplace-transform3.png" alt-text="Screenshot of testing the transformation.":::

The following table provides information about testing the transformations. The actions listed in the table correspond to the labels in the previous image.

| Action | Field | Description |
| :----- | :---- | :---------- |
| 1 | `Test transformation` | Select the close or (X) button to hide the test section and re-render the **Test transformation** button again on the blade. |
| 2 | `Test regex input` | Accepts input that is used for the regular expression test evaluation. In case regex-based claims transformation is configured as a second level transformation, provide a value that is the expected output of the first transformation. |
| 3 | `Run test` | After the test regex input is provided and the **Regex pattern**, **Replacement pattern** and **Input parameters** are configured, the expression can be evaluated by selecting **Run test**. |
| 4 | `Test transformation result` | If evaluation succeeds, an output of test transformation is rendered against the **Test transformation result** label. |
| 5 | `Remove transformation` | The second level transformation can be removed by selecting **Remove transformation**. |
| 6 | `Specify output if no match` | When a regex input value is configured against the *Parameter 1* that doesn't match the **Regular expression**, the transformation is skipped. In such cases, the alternate user attribute can be configured, which is added to the token for the claim by checking **Specify output if no match**. |
| 7 | `Parameter 3` | If an alternate user attribute needs to be returned when there's no match and **Specify output if no match** is checked, an alternate user attribute can be selected using the dropdown. This dropdown is available against **Parameter 3 (output if no match)**. |
| 8 | `Summary` | At the bottom of the blade, a full summary of the format is displayed that explains the meaning of the transformation in simple text. |
| 9 | `Add` | After the configuration settings for the transformation are verified, it can be saved to a claims policy by selecting **Add**. Select **Save** on the **Manage Claim** blade to save the changes. |

RegexReplace() transformation is also available for the group claims transformations.

### Transformation validations

A message provides more information when the following conditions occur after selecting **Add** or **Run test**:

* Input parameters with duplicate user attributes were used.
* Unused input parameters found. Defined input parameters should have respective usage into the Replacement pattern text.
* The provided test regex input doesn't match with the provided regular expression.
* No sources for the groups in the replacement pattern are found.

## Emit claims based on conditions

You can specify the source of a claim based on user type and the group to which the user belongs.

The user type can be:

* **Any** - All users are allowed to access the application.
* **Members**: Native member of the tenant
* **All guests**: User moved from an external organization with or without Azure AD.
* **AAD guests**: Guest user belongs to another organization using Azure AD.
* **External guests**: Guest user belongs to an external organization that doesn't have Azure AD.

One scenario where the user type is helpful is when the source of a claim is different for a guest and an employee accessing an application. You can specify that if the user is an employee, get the NameID from user.email. If the user is a guest, then the NameID comes from user.extensionattribute1.

To add a claim condition:

1. In **Manage claim**, expand the Claim conditions.
1. Select the user type.
1. Select the group(s) to which the user should belong. You can select up to 50 unique groups across all claims for a given application.
1. Select the **Source** where the claim is going to retrieve its value. You can select a user attribute from the source attribute dropdown or apply a transformation to the user attribute before emitting it as a claim.

The order in which you add the conditions are important. Azure AD first evaluates all conditions with source `Attribute` and then evaluates all conditions with source `Transformation` to decide which value to emit in the claim. Azure AD evaluates conditions with the same source from top to bottom. The claim emits the last value that matches the expression in the claim. Transformations such as `IsNotEmpty` and `Contains` act like  restrictions.

For example, Britta Simon is a guest user in the Contoso tenant. Britta belongs to another organization that also uses Azure AD. Given the following configuration for the Fabrikam application, when Britta tries to sign in to Fabrikam, the Microsoft identity platform evaluates the conditions.

First, the Microsoft identity platform verifies whether Britta's user type is **All guests**. Because the type is **All guests**, the Microsoft identity platform assigns the source for the claim to `user.extensionattribute1`. Second, the Microsoft identity platform verifies whether Britta's user type is **AAD guests**. Because the type is **All guests**, the Microsoft identity platform assigns the source for the claim to `user.mail`. Finally, the claim is emitted with a value of `user.mail` for Britta.

:::image type="content" source="./media/jwt-claims-customization/sso-saml-user-conditional-claims.png" alt-text="Screenshot of claims conditional configuration.":::

As another example, consider when Britta Simon tries to sign in using the following configuration. Azure AD first evaluates all conditions with source `Attribute`. The source for the claim is `user.mail` when Britta's user type is **AAD guests**. Next, Azure AD evaluates the transformations. Because Britta is a guest, `user.extensionattribute1` is the new source for the claim. Because Britta is in **AAD guests**, `user.othermail` is the new source for this claim. Finally, the claim is emitted with a value of `user.othermail` for Britta.

:::image type="content" source="./media/jwt-claims-customization/sso-saml-user-conditional-claims-2.png" alt-text="Screenshot of more claims conditional configuration.":::

As a final example, consider what happens if Britta has no `user.othermail` configured or it's empty. The claim falls back to `user.extensionattribute1` ignoring the condition entry in both cases.

## Advanced claims options

Configure advanced claims options for OIDC applications to expose the same claim as SAML tokens. Also for applications that intend to use the same claim for both SAML2.0 and OIDC response tokens.  

Configure advanced claim options by checking the box under **Advanced Claims Options** in the **Manage claims** blade.

## Next steps

* Learn more about the [claims and tokens used in Azure AD](security-tokens.md).
