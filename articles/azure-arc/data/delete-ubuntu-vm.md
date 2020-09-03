# Delete Ubuntu 18.04 virtual machine in Azure

This document explains how to delete the virtual machine created in Azure to deploy the kickstarter script.

> Please note that this script deletes at the resource group level. If you have installed other objects in the resource group they will be deleted as well.

## Login to Azure

Log into to Azure if you are not already logged in.

```terminal
az login
```

## Delete the resource group

Delete the virtual machine by deleting the resource group that owns the virtual machine and its dependent resources.

```terminal
az group delete --resource-group azurearcvm-rg --subscription 10760148-90d3-4744-973e-3e12e8ba28bf 
```

At the prompt confirm the action:
```
Are you sure you want to perform this operation? (y/n): y
```
