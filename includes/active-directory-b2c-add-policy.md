Click **+Add** at the top of the blade.

The **Name** determines the sign-up policy name used by your application. For example, enter "SiUpIn".

Click **Identity providers** and select "Email signup". Optionally, you can also select social identity providers, if already configured. Click **OK**.

Click **Sign-up attributes**. Here you choose attributes that you want to collect from the consumer during sign-up. For example, select "Country/Region", "Display Name" and "Postal Code". Click **OK**.

Click **Application claims**. Here you choose claims that you want returned in the tokens sent back to your application after a successful sign-up or sign-in experience. For example, select "Display Name", "Identity Provider", "Postal Code", "User is new" and "User's Object ID".

Click **Create**. Note that the policy just created appears as "**B2C_1_SiUpIn**" (the **B2C\_1\_** fragment is automatically added) in the **Sign-up or sign-in policies** blade.