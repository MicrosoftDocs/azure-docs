
> [!NOTE]
> When you estimate consumption costs, consider the potential 
> number of messages or events that might arrive on any given day, 
> rather than basing your estimates on just the polling interval. 
> 
> When triggers find an event or message that meets the specified criteria, 
> they immediately try to read any and all waiting events or messages 
> that meet the trigger criteria. So, even when you specify 
> a longer polling interval, the trigger fires based on the 
> number of events or messages that qualify for starting workflows. 
> Such triggers include Azure Service Bus and Azure Event Hub. 
>
> For example, suppose you set up trigger that checks an endpoint daily. 
> When the trigger checks the endpoint and finds 15 events that meet the criteria, 
> the trigger fires and runs the specified workflow 15 times. 
> All actions performed by those 15 workflows, including the trigger requests, 
> are metered.