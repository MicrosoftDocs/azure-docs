
   * Sign in to the Azure account by entering your credentials.

     This method is quicker and easier, but if you use this method you won't be able to see Azure SQL Database or Mobile Services in the **Server Explorer** window.

     In **Server Explorer**, click the **Connect to Azure** button. An alternative is to right-click the **Azure** node, and then click **Connect to Azure** in the context menu.

   * Install a management certificate that enables access to your account.

     In **Server Explorer**, right-click the **Azure** node, and then click **Manage Subscriptions** in the context menu. In the **Manage Azure Subscriptions** dialog box, click the **Certificates** tab, and then click **Import**. Follow the directions to download and then import a subscription file (also called a *.publishsettings* file) for your Azure account.

     > [AZURE.NOTE] Download the subscription file to a folder outside your source code directories (for example, in the Downloads folder), and then delete it once the import has completed. A malicious user who gains access to the subscription file can edit, create, and delete your Azure services.

	For more information, see [How to Connect to Azure from Visual Studio](http://go.microsoft.com/fwlink/?LinkId=324796).
