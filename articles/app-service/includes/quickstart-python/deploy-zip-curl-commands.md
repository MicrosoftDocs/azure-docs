##### [bash](#tab/terminal-bash)

```bash
curl -X POST \
    -H 'Content-Type: application/zip' \
    -u <deployment-user> \
    -T <zip-file-name> \
    https://<app-name>.scm.azurewebsites.net/api/zipdeploy
```

##### [PowerShell terminal](#tab/terminal-powershell)

For PowerShell, make sure to enclose the username in single quotes so PowerShell does not try to interpret the username as a PowerShell variable.

```powershell
curl -X POST `
    -H 'Content-Type: application/zip' `
    -u '<deployment-user>' `
    -T <zip-file-name> `
    https://<app-name>.scm.azurewebsites.net/api/zipdeploy
```

---
