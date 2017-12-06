In the Azure portal, click **Resource groups** > **cloud-shell-storage-\<your_region>** > **\<storage_account_name>**.

![](../articles/app-service/media/app-service-deploy-zip/upload-choose-storage-account.png)

In the **Overview** page of the storage account, select **Files**.

Select the automatically generated file share (which is mounted in the Cloud Shell as `clouddrive`), and select **Upload**.

![](../articles/app-service/media/app-service-deploy-zip/upload-select-button.png)

Click the file selector and select your .zip file, then click **Upload**. 

In the Cloud Shell, use `ls` to verify that you can see the uploaded .zip file in the default `clouddrive` share.

```azurecli-interactive
ls clouddrive
```
