---
author: DavidCBerry13
ms.author: daberry
ms.topic: include
ms.date: 01/29/2022
---
Get the \<URL> from your Kudu Environment: 

1. Open your app in the Azure portal and select **Development Tools** > **Advanced Tools**, then select **Go**.
1. Copy the value from the address bar and append */api/zipdeploy*.

##### [bash](#tab/terminal-bash)

```bash
curl -X POST \
    -H 'Content-Type: application/zip' \
    -u '<deployment-user>' \
    -T <zip-file-name> \
    <URL>
```

##### [PowerShell terminal](#tab/terminal-powershell)

For PowerShell, make sure to enclose the username in single quotes so PowerShell does not try to interpret the username as a PowerShell variable.

```powershell
curl -X POST `
    -H 'Content-Type: application/zip' `
    -u '<deployment-user>' `
    -T <zip-file-name> `
    <URL>
```

---
