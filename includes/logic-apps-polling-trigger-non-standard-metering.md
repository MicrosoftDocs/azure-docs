
> [!NOTE]
> When you estimate consumption costs, 
> consider the potential number of messages or events 
> that might arrive on any given day, 
> rather than using only the polling interval. 
> 
> Even though you might specify a longer polling interval, 
> when a trigger finds events or messages that meet your criteria, 
> many triggers, such as Azure Service Bus and Azure Event Hub, 
> immediately try to read all waiting events or messages until none remain. 
> This behavior affects when actions are metered and charged, 
> but not the total processing cost. 
> Triggers eventually process all available events or messages.