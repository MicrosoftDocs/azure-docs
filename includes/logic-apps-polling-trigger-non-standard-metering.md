
> [!NOTE]
> Some polling triggers, such as Azure Service Bus and Azure Event Hub, 
> use *long polling* behavior where a trigger waits at least 30 seconds 
> for events or messages to arrive before reading them. If the trigger 
> finds events or messages that fit the specified criteria, 
> the trigger immediately tries to read any other new events 
> or messages until no more remain for processing. 
> 
> As a result, the trigger might save up so many events 
> or messages that the trigger continuously checks for them. 
> This behavior affects the time intervals over when actions 
> are metered and charged, but not the total processing cost. 
> The trigger eventually processes all available events or messages.
