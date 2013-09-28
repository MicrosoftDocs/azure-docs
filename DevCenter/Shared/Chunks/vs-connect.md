1. In Visual Studio, connect to the Windows Azure account that you want to work with by using one of the following methods. The first method is quicker and easier but connects to Windows Azure only for the duration of the Visual Studio session, for up to 8 hours. The second method enables Visual Studio to connect automatically every time you run it. For more information, see [How to Connect to Windows Azure from Visual Studio](http://go.microsoft.com/fwlink/?LinkId=324796).

   * Sign in to the Windows Azure account by entering your credentials.

     In **Server Explorer**, click the **Connect to Windows Azure** button. An alternative is to right-click the **Windows Azure** node, and then click **Connect to Windows Azure** in the context menu.

   * Install a certificate that enables access to your account.

     In **Server Explorer**, right-click the **Windows Azure** node, and then click **Manage Subscriptions** in the context menu. In the **Manage Windows Azure Subscriptions** dialog box, click the **Certificates** tab, and then click **Import**. Follow the directions to download and then import a subscription file (also called a *.publishsettings* file) for your Windows Azure account.

     <div class="dev-callout"><p><strong>Security Note:</strong>
     Download the subscription file to a folder outside your source code directories (for example, in the Libraries\Documents folder), and then delete it once the import has completed. A malicious user who gains access to the suscription file can edit, create, and delete your Windows Azure services.</p></div>
