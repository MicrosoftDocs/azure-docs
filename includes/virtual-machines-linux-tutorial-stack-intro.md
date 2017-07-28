## Before you begin

To complete the example in this tutorial, you must have an existing Ubuntu Linux virtual machine (the 'L' in the LAMP stack). If needed, this [script sample](../articles/virtual-machines/scripts/virtual-machines-linux-cli-sample-create-vm-quick-create.md) can create one for you. When working through the tutorial, replace the resource group and VM names where needed. 


## Open port 80 for web traffic 

By default, only SSH connections are allowed into Linux VMs deployed in Azure. Because this VM is going to be a web server, you need to open port 80 from the internet. Use the [az vm open-port](/cli/azure/vm#open-port) command to open the desired port.  
 
```azurecli-interactive 
az vm open-port --port 80 --resource-group myResourceGroup --name myVM
```
## SSH into your VM


If you don't already know the public IP address of your VM, run the [az network public-ip list](/cli/azure/network/public-ip#list) command:


```azurecli-interactive
az network public-ip list --resource-group myResourceGroup --query [].ipAddress
```

Use the following command to create an SSH session with the virtual machine. Substitute the correct public IP address of your virtual machine. In this example, the IP address is *40.68.254.142*.

```bash
ssh 40.68.254.142
```

