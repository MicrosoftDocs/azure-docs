> [!WARNING]
> When you enable diagnostics on an existing role, any extensions you have enabled will be disabled when the package is deployed. These include:
>
> * Microsoft Monitoring Agent Diagnostics
> * Microsoft Azure Security Monitoring
> * Microsoft Antimalware                 
> * Microsoft Monitoring Agent
> * Microsoft Service Profiler Agent      
> * Windows Azure Domain Extension        
> * Windows Azure Diagnostics Extension   
> * Windows Azure Remote Desktop Extension
> * Windows Azure Log Collector
>
> You may re-enable your extensions via the Azure Portal or PowerShell after you have deployed the updated role.
>
