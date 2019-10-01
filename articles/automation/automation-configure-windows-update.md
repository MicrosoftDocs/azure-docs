# Configure Windows Update settings for Update Management

## <a name="firstparty-predownload"></a>Advanced settings

Update Management relies on Windows Update to download and install Windows Updates. As a result, we respect many of the settings used by Windows Update. If you use settings to enable non-Windows updates, Update Management will manage those updates as well. If you want to enable downloading updates before an update deployment occurs, update deployments can go faster and be less likely to exceed the maintenance window.

### Pre download updates

To configure automatically downloading updates in Group Policy, you can set the [Configure Automatic Updates setting](/windows-server/administration/windows-server-update-services/deploy/4-configure-group-policy-settings-for-automatic-updates##configure-automatic-updates) to **3**. This downloads the updates needed in the background, but doesn't install them. This keeps Update Management in control of schedules but allow updates to download outside of the Update Management maintenance window. This can prevent **Maintenance window exceeded** errors in Update Management.

You can also set this with PowerShell, run the following PowerShell on a system that you want to auto-download updates.

```powershell
$WUSettings = (New-Object -com "Microsoft.Update.AutoUpdate").Settings
$WUSettings.NotificationLevel = 3
$WUSettings.Save()
```

### Disable automatic installation

Azure VMs have Automatic installation of updates enabled by default. This can cause updates to be installed before you schedule them to be installed by Update Management. You can disable this behavior by setting the `NoAutoUpdate` registry key to `1`. The following PowerShell snippet shows you one way to do this.

```powershell
$AutoUpdatePath = "HKLM:SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU"
Set-ItemProperty -Path $AutoUpdatePath -Name NoAutoUpdate -Value 1
```

### Enable updates for other Microsoft products

By default, Windows Update only provides updates for Windows. If you enable **Give me updates for other Microsoft products when I update Windows**, you're provided with updates for other products, including security patches for SQL Server or other first party software. This option can't be configured by Group Policy. Run the following PowerShell on the systems that you wish to enable other first party patches on, and Update Management will honor this setting.

```powershell
$ServiceManager = (New-Object -com "Microsoft.Update.ServiceManager")
$ServiceManager.Services
$ServiceID = "7971f918-a847-4430-9279-4a52d1efe18d"
$ServiceManager.AddService2($ServiceId,7,"")
```
