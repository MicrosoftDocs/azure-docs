$userinput = Read-Host -Prompt "Type 1 if you want to execute the script for one or few apps via CSV OR Type 2 if you want to execute the script for the whole tenant"
if($userinput -eq '1')
{
$fpth=Read-Host -Prompt "Enter file path"
Write-Host "the filepath you entered is $fpth"
Disconnect-MgGraph
Select-MgProfile -Name "beta"
Connect-Graph -Scopes "Application.ReadWrite.All,DelegatedPermissionGrant.ReadWrite.All" 
$aa = Import-Csv -Path $fpth 
$bb = $aa.Id
$output = @()
foreach($spobjidd in $bb){
$cc= Get-MgServicePrincipalOauth2PermissionGrant -ServicePrincipalId $spobjidd 
$dd = $cc.Id
$ee = $cc.Scope
if($dd.count-eq 1 -and $ee -eq 'User.Read'){
$output += New-Object psobject -Property @{
Id= $cc.ClientId
AppId = (Get-MgServicePrincipal -ServicePrincipalId $cc.ClientId ).AppId
}
}
}$output|Export-Csv -NoTypeInformation -Path C:\mango.csv
Start-Sleep -Seconds 10
$xx= Import-Csv -Path C:\mango.csv
$b= $xx.Id 
$d=$xx.AppId
$graphResourceId = "00000003-0000-0000-c000-000000000000"
$newResourceAccess = @{  
    ResourceAppId = $graphResourceId; 
    ResourceAccess = @( 

        ## Replace the following with values of ID and type for all permissions you want to configure for the app
        @{ 
            # User.Read scope (delegated permission) to sign-in and read user profile 
            id = "e1fe6dd8-ba31-4d61-89e7-88639da4683d";  
            type = "Scope"; 
        }
    ) 
}

foreach($spobjid in $b){
$x = Get-MgServicePrincipalOauth2PermissionGrant -ServicePrincipalId $spobjid
$c= $x.Id
Remove-MgOauth2PermissionGrant -OAuth2PermissionGrantId $c
}

foreach($appid in $d){
$m=Get-MgApplication -Filter "AppId eq '$appid' "
$n= $m.Id
Update-MgApplication -ApplicationId $n -RequiredResourceAccess $newResourceAccess
}

##use the objectid of SP of the app in ClientID and under Resource ID, give the ObjectID of Microsoft Graph(this can be found under Enterprise Apps of the Azure AD tenant)
foreach($spoid in $b){
New-MgOauth2PermissionGrant -ClientId $spoid -ConsentType AllPrincipals -ResourceId 41c5375f-db2f-49ea-92fb-e5c29d4b064d -Scope User.Read
}
}
elseif($userinput -eq '2')
{
Disconnect-MgGraph
Select-MgProfile -Name "v1.0"
Connect-Graph -Scopes "Application.ReadWrite.All,DelegatedPermissionGrant.ReadWrite.All" 
$aa = Get-MgServicePrincipal -All | where-object {$_.Tags -Contains "WindowsAzureActiveDirectoryOnPremApp"}
$bb = $aa.Id
$output = @()
foreach($spobjidd in $bb){
$cc= Get-MgServicePrincipalOauth2PermissionGrant -ServicePrincipalId $spobjidd 
$dd = $cc.Id
$ee = $cc.Scope
if($dd.count-eq 1 -and $ee -eq 'User.Read'){
$output += New-Object psobject -Property @{
Id= $cc.ClientId
AppId = (Get-MgServicePrincipal -ServicePrincipalId $cc.ClientId ).AppId
}
}
}$output|Export-Csv -NoTypeInformation -Path C:\mango.csv
Start-Sleep -Seconds 10
$xx= Import-Csv -Path C:\mango.csv
$b= $xx.Id 
$d=$xx.AppId
$graphResourceId = "00000003-0000-0000-c000-000000000000"
$newResourceAccess = @{  
    ResourceAppId = $graphResourceId; 
    ResourceAccess = @( 

        ## Replace the following with values of ID and type for all permissions you want to configure for the app
        @{ 
            # User.Read scope (delegated permission) to sign-in and read user profile 
            id = "e1fe6dd8-ba31-4d61-89e7-88639da4683d";  
            type = "Scope"; 
        }
    ) 
}
foreach($spobjid in $b){
$x = Get-MgServicePrincipalOauth2PermissionGrant -ServicePrincipalId $spobjid
$c= $x.Id
Remove-MgOauth2PermissionGrant -OAuth2PermissionGrantId $c
}

foreach($appid in $d){
$m=Get-MgApplication -Filter "AppId eq '$appid' "
$n= $m.Id
Update-MgApplication -ApplicationId $n -RequiredResourceAccess $newResourceAccess
}

##use the objectid of SP of the app in ClientID and under Resource ID, give the ObjectID of Microsoft Graph(this can be found under Enterprise Apps of the Azure AD tenant)
foreach($spoid in $b){
New-MgOauth2PermissionGrant -ClientId $spoid -ConsentType AllPrincipals -ResourceId 41c5375f-db2f-49ea-92fb-e5c29d4b064d -Scope User.Read
}
}
else{ "Sorry,you entered a wrong choice"}
