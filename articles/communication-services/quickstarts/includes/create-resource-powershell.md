## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet/).

## PowerShell

You can also use PowerShell to create a new communication resource or update an existing Azure Communication Services resource.

### Create Default Resource

```powershell
PS C:\> New-AzSpool -Name MyACS -ResourceGroupName MyRg -Location westus2

Location Name     Type
-------- ----     ----
westus2  MyACS  Microsoft.SpoolService/spools
```

Creates a new Communication Services resource using only default values.

### Create Fully Specified Resource

Creates a new communication service with tags.

```powershell
PS C:\> New-AzSpool -Name MyNewComm -ResourceGroupName MyRg -SubscriptionId 00000000-0000-0000-0000-000000000000 -Location westus2 -Tag @{
>> FirstTag = 'FirstTagValue'
>> SecondTag = 'SecondTagValue'
}

Location Name     Type
-------- ----     ----
westus2  MyNewComm  Microsoft.SpoolService/spools
```