---
title: Manage add-in names in Partner Center
description:
localization_priority: Normal
---

# Manage add-in names in Partner Center

You can use the **Manage product names** page to view all the names that you've reserved for your add-in, reserve additional names (for other languages or to change the name of your add-in), and delete names you don't need. You can find this page in [Partner Center](https://partner.microsoft.com/office/overview) by expanding the **Product management** section in the left navigation menu for any of your add-ins.

## Reserve additional names for your add-in

You can reserve multiple names to use for the same add-in. This is useful if you're offering your add-in in multiple languages and want to use different names for different languages. You can also reserve a new name to change the name of your add-in.

To reserve a new name, find the text box in the **Reserve more names** section of the **Manage product names** page. Enter the name you'd like to reserve, then select **Check availability**. If the name is available, select **Reserve product name**. You can reserve multiple names by repeating these steps.

## Delete add-in names

If you no longer want to use a name you previously reserved, you can release it by deleting it on the **Manage product names** page. Make sure you're certain before you do so, because the name will immediately become available for someone else to reserve and use.

To delete one of your reserved names, find the name you no longer want to use and then select **Delete**. In the confirmation dialog box, select **Delete** again to confirm.

Note that your add-in must have at least one reserved name. To remove an add-in from Partner Center (and release all the names you've reserved), click **Delete this app** from the **App overview** page. If you have a submission for the app in progress, you'll need to delete that submission first. Note that if you've already published the app to the Store, you can't delete it from Partner Center (though you can use the **Show/hide products** functionality on your **Overview** page to hide it). 


## Rename an app that has already been published

If your app is already in the Store and you want to rename it, you can do so by reserving a new name for it (by following the steps described above) and then creating a new submission for the app. 

You must update your app's package(s) to replace the old name with the new one and upload the updated package(s) to your submission.
- First, update the Package.StoreAssociation.xml file to use the new name, either manually or by using Visual Studio (**Project > Store > Associate App with the Store...**). For more info, see [Package a UWP app with Visual Studio](../packaging/packaging-uwp-apps.md).
- You'll also need to update the [**Package/Properties/DisplayName**](https://docs.microsoft.com/uwp/schemas/appxpackage/uapmanifestschema/element-displayname) element in your app manifest, and update any graphics or text that includes the app's name. 
  > [!IMPORTANT]
  > Be sure to update the Package.StoreAssociation.xml file before you change the **Package/Properties/DisplayName** in the app manifest, or you may get an error.

To update a Store listing so that it uses the new name, go to the [Store listing page](create-app-store-listings.md) for that language and select the name from the **Product name** dropdown. Be sure to review your description and other parts of the listing for any mentions of the name and make updates if needed.

> [!NOTE]
> If your app has packages and/or Store listings in multiple languages, you'll need to update the packages and/or Store listings for every language in which the name needs to be updated.

Once your app has been published with the new name, you can delete any older names that you no longer need to use.

> [!TIP]
> Each app appears in Partner Center using the first name which you reserved for it. If you've followed the steps above to rename an app, and you'd like it to appear in Partner Center using the new name, you must delete the original name (by clicking **Delete** on the **Manage app names** page). 