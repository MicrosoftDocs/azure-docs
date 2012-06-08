To use storage operations, you need a Windows Azure storage account. You
can create a storage account by following these steps. (You can also
create a storage account [using the REST API].)

1.  Log into the [Windows Azure Management Portal].

2.  At the bottom of the navigation pane, click **+NEW**.

	![+new][plus-new]

3.  Click **Storage Account**, and then click **Quick Create**.

	![Quick create dialog][quick-create-storage]

4.  In URL, type a subdomain name to use in the URI for the
    storage account. The entry can contain from 3-24 lowercase letters
    and numbers. This value becomes the host name within the URI that is
    used to address Blob, Queue, or Table resources for the
    subscription.

5.  Choose a Region/Affinity Group in which to locate the
    storage. If you will be using storage from your Windows Azure
    application, select the same region where you will deploy your
    application.

6.  Click **Create Storage Account**.

[using the REST API]: http://msdn.microsoft.com/en-us/library/windowsazure/hh264518.aspx
[Windows Azure Management Portal]: http://manage.windowsazure.com
[plus-new]: ../../Shared/Media/plus-new.png
[quick-create-storage]: ../../Shared/Media/quick-storage.png