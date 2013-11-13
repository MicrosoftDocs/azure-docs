
1. Log into the [Windows Azure Management Portal], click **Mobile Services**, and then click your app.

   ![][0]

2. Click the **Data** tab, and then click **Create**.

   ![][1]

   This displays the **Create new table** dialog.

3. Keeping the default **Anybody with the application key** setting for all permissions, type _Registrations_ in **Table name**, and then click the check button.

   ![][2]

  This creates the **Registrations** table, which stores the channel URIs used to send push notifications.

Next, you will modify the your app to enable push notifications.

<!-- Images. -->
[0]: ../Media/mobile-services-selection.png
[1]: ../Media/mobile-create-table.png
[2]: ../Media/mobile-create-registrations-table.png

<!-- URLs -->
[Windows Azure Management Portal]: https://manage.windowsazure.com/
