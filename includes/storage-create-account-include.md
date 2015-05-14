## Create an Azure Storage account

To use Azure storage, you'll need a storage account. You 
can create a storage account by following these steps. (You can also
create a storage account by using the Azure service management client library or the service management [REST API].)

1.  Log into the [Azure Management Portal].

2.  At the bottom of the navigation pane, click **NEW**.

	![+new][plus-new]

3.  Click **DATA SERVICES**, then **STORAGE**, and then click **QUICK CREATE**.

	![Quick create dialog][quick-create-storage]

4.  In URL, type a subdomain name to use in the URI for the
    storage account. The entry can contain from 3-24 lowercase letters
    and numbers. This value becomes the host name within the URI that is
    used to address Blob, Queue, or Table resources for the
    subscription.

5.  Choose a Region/Affinity Group in which to locate the
    storage. If you will be using storage from your Azure
    application, select the same region where you will deploy your
    application.

6. Optionally, you can select the type of replication you desire for your account. Geo-redundant replication is the default and provides maximum durability. For more details on replication options, see [Azure Storage Redundancy Options](http://msdn.microsoft.com/library/azure/dn727290.aspx) and the [Azure Storage Team Blog](http://blogs.msdn.com/b/windowsazurestorage/).

6.  Click **CREATE STORAGE ACCOUNT**.

[REST API]: http://msdn.microsoft.com/library/azure/hh264518.aspx
[Azure Management Portal]: http://manage.windowsazure.com
[plus-new]: ./media/storage-create-account-include/plus-new.png
[quick-create-storage]: ./media/storage-create-account-include/quick-storage-2.png
