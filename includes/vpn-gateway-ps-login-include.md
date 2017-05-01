Before beginning this configuration, you must log in to your Azure account. The cmdlet prompts you for the login credentials for your Azure account. After logging in, it downloads your account settings so they are available to Azure PowerShell. For more information, see [Using Windows PowerShell with Resource Manager](../articles/powershell-azure-resource-manager.md).

Open your PowerShell console with elevated privileges, and connect to your account. Use the following example to help you connect:

```powershell
Login-AzureRmAccount
```

If you have multiple Azure subscriptions, check the subscriptions for the account.

```powershell
Get-AzureRmSubscription
```

Specify the subscription that you want to use.

```powershell
Select-AzureRmSubscription -SubscriptionName "Replace_with_your_subscription_name"
 ```