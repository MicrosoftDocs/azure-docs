## Enable diagnostics on a new virtual machine

1. When creating a new Virtual Machine from the Preview Portal, select the **Azure Resource Manager** from the deployment model dropdown:
 
    ![Resource Manager](./media/virtual-machines-common-boot-diagnostics/screenshot3.jpg)

2. Configure the Monitoring option to select the storage account where you would like to place these diagnostic files.
 
    ![Create VM](./media/virtual-machines-common-boot-diagnostics/screenshot4.jpg)

3. If you are deploying from an Azure Resource Manager template, navigate to your Virtual Machine resource and append the diagnostics profile section. Remember to use the “2015-06-15” API version header.

    ```json
    {
          "apiVersion": "2015-06-15",
          "type": "Microsoft.Compute/virtualMachines",
          …
    ```

4. The diagnostics profile enables you to select the storage account where you want to put these logs.

    ```json
            "diagnosticsProfile": {
                "bootDiagnostics": {
                "enabled": true,
                "storageUri": "[concat('http://', parameters('newStorageAccountName'), '.blob.core.windows.net')]"
                }
            }
            }
        }
    ```

To deploy a sample Virtual Machine with boot diagnostics enabled, check out our repo here.

## Update an existing virtual machine

To enable boot diagnostics through the Portal, you can also update an existing Virtual Machine through the Portal. Select the Boot Diagnostics option and Save. Restart the VM to take effect.

![Update Existing VM](./media/virtual-machines-common-boot-diagnostics/screenshot5.png)
