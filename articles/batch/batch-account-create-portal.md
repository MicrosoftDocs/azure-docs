To create a Batch account in the portal:

1. Sign in to the [Azure Preview portal](https://portal.azure.com).

2. Click **New** > **Compute** > **Marketplace** > **Everything**, and then enter *Batch* in the search box.

	![Batch in the Marketplace][marketplace_portal]

3. Click **Batch Service** in the search results, and then click **Create**.

4. In the **New Batch Account** blade, enter the following information:

	a. In **Account Name**, enter a unique name to use in the Batch account URL.

	>[AZURE.NOTE] The Batch account name must be unique to Azure, contain between 3 and 24 characters, and use lowercase letters and numbers only.

	b. Click **Resource group** to select an existing resource group for the account, or create a new one.

	c. If you have more than one subscription, click **Subscription** to select an available subscription where the account will be created.

	d. In **Location**, select an Azure region in which Batch is available.

	![Create a Batch account][account_portal]

5. Click **Create** to complete the account creation.


After the account is created, you can find it in the portal to manage access keys and other settings. For example, click the key icon to manage the access keys.

![Batch account keys][account_keys]




[marketplace_portal]: ./media/batch-account-create-portal/marketplace_batch.PNG
[account_portal]: ./media/batch-account-create-portal/batch_acct_portal.png
[account_keys]: ./media/batch-account-create-portal/account_keys.PNG
