To enable profile editing on your application, you will need to create a profile editing policy. This policy describes the experiences that consumers will go through during profile editing and the contents of tokens that the application will receive on successful completion.

[!INCLUDE [active-directory-b2c-portal-navigate-b2c-service](active-directory-b2c-portal-navigate-b2c-service.md)]

In the policies section of settings, select **Profile editing policies** and click **+ Add**.

![Select Profile editing policies and click the Add button](media/active-directory-b2c-create-profile-editing-policy/add-b2c-editing-policy.png)

Enter a policy **Name** for your application to reference. For example, enter `SiPe`.

Select **Identity providers** and check **Local Account Signin**. Optionally, you can also select social identity providers, if already configured. Click **OK**.

![Select Local Account Signin as an identity provider and click the OK button](media/active-directory-b2c-create-profile-editing-policy/add-b2c-editing-identity-providers.png)

Select **Profile attributes**. Choose attributes the consumer can view and edit in their profile. For example, check **Country/Region**, **Display Name**, and **Postal Code**. Click **OK**.

![Select some attributes and click the OK button](media/active-directory-b2c-create-profile-editing-policy/add-b2c-editing-attributes.png)

Select **Application claims**. Choose claims you want returned in the authorization tokens sent back to your application after a successful profile editing experience. For example, select **Display Name**, **Postal Code**.

![Select some application claims and click OK button](media/active-directory-b2c-create-profile-editing-policy/add-b2c-editing-application-claims.png)

Click **Create** to add the policy. The policy is listed as **B2C_1_SiPe**. The **B2C_1_** prefix is appended to the name.

Open the policy by selecting **B2C_1_SiPe**. Verify the settings specified in the table then click **Run now**.

![Select policy and run it](media/active-directory-b2c-create-profile-editing-policy/run-b2c-editing-policy.png)

| Setting      | Value  |
| ------------ | ------ |
| **Applications** | Contoso B2C app |
| **Select reply url** | `https://localhost:44316/` |

A new browser tab opens, and you can verify the profile editing consumer experience as configured.

> [!NOTE]
> It takes up to a minute for policy creation and updates to take effect.
>