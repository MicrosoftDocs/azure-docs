# AOAI Dynamic Quota (Preview)

Dynamic Quota is an AOAI feature that enables a Pay-Go deployment to opportunistically get more quota when server capacity is available. When Dynamic Quota is set to off, your deployment will be able to process a maximum throughput established by your tokens per second setting - more requests above that will return HTTP 429 responses. When Dynamic Quota is enabled, the deployment may occasionally provide a higher throughput before returning 429 responses, allowing you to perform more calls earlier. The additional requests are still paid with regular pricing.

Dynamic Quota can only temporarily *increase* your available quota: it will never decrease below your configured value.

## When to use Dynamic Quota
Dynamic Quota is useful in most scenarios, particularly when your application can use extra capacity opportunistically or the application itself is driving the rate at which the AOAI API is called.

The only situations in which you may prefer to avoid it is when your application may provide an adverse experience if quota is volatile. 

For Dynamic quota, consider scenarios such as:
* Bulk processing, 
* Creating summarizations or embeddings for RAG,
* Offline analysis of logs for generation of metrics and evaluations, 
* Low-priority research, 
* Apps that have very little quota allocated.


### When does Dynamic Quota come into effect?

The AOAI backend decides if, when and how much extra dynamic quota is added or removed from different deployments. It is not forecasted or announced in advance, and is not predictable. AOAI lets your application know there is more quota available by simply not responding with 429 and letting your calls through. To take advantage of Dynamic Quota, your application code must be able to issue more requests as 429s become infrequent.


### How does Dynamic Quota change costs?
Calls that are done above your base quota have the same SLAs and costs as regular calls.
There is no extra cost to turn on Dynamic quota on a deployment.

Note with Dynamic Quota, there is no call enforcement of a "ceiling" quota or throughput. AOAI will process as many requests as it can above your baseline quota. If you need to control the rate of spend even when quota is less constrained, youur application code needs to hold back requests accordingly.


## How to use Dynamic Quota

To use Dynamic Quota you must
1. Turn the Dynamic Quota property on in your AOAI deployment, and
2. Make sure your application can take advantage of Dynamic Quota

### 1. How to turn Dynamic Quota On
To activate Dynamic Quita for your deployment, you can go to the deployment properties in the resource configuration, and switch it on:

![image](https://user-images.githubusercontent.com/1182549/279494568-99aa9c98-2fb4-42a0-a17e-201df028f420.png)

Alternatively, you can enable it programatically:

```
az rest --method patch --url { your deploymenbt URL} --body '{"properties": {"dynamicThrottlingEnabled": true} }'
```

## 2. How to use Dynamic Quota in your application

AOAI Ddeployments return 429 when the throughput limit is being reached. With Dynamic Quota, this limit will be on occasions reached with higher demand than usual.

You can acheive this by coding your application so it adjusts the rate of requests based on the 429 responses it receives, for example, issuing more or less requests until no more than one 429 error is encountered every 2 minutes. 

``` 
// Pseudocode for application code that dynamically adjusts with dynamic quota availability.
// This code adjusts the wait time between requests by monitoring the rate of 429 responses.
// If there are 429s encountered, the wait time goes slightly up. if there are no 429s in a couple minutes, the waiti time goes slightly down.
// More sophisticated implementations could implement PID and other approximation algorithms, but this will be good enough for most situations.

wait_time = 1000; //time to wait between calls

last_429_time = null //to keep track of last time a 429 error was encountered.

wait_time_step_up = 200; //time to add in milliseconds if 429 is encountered
wait_time_step_down =100; //time to add in milliseconds if 429 is encountered

min_wait_time = 100; //don't wait less than this, even if we are not getting 429s


while (there_is_work_to_be_done)
{
    response = {call AOAI API}
    
    //adjust wait time dynamically
    if (response.status_code == 429)
    {
        //429: increasing wait time
        wait_time = wait time + wait_time_step_up;
        last_429_time = now();
    }
    else
    {
        //# Check if it has been 2 minutes since the last 429
        if ( (last_429_time > 0) && (now() - last_429_time >= 120) )
        {
            wait_time = max (min_wait_time, wait_time - wait_step_down);
            last_429_time = null;
        }
    }
    
    // more work...
    
    sleep (wait_time);
}

```

#### How do I know how much throughput Dynamic Quota is adding to my app?

To monitor how it is working, you can track the throughput of your application in Azure Monitor. During the Preview of Dynamic Quota there is no specific metric or log to indicate quota has been dynamically increased or decreased.
Dynamic quota is less likely to appear for your deployment if it runs in heavily utilized regions, and during peak hours of use for those regions. 



## More Information {AOAI docs team}
* Setting Quota on an AOAI endpoint
* 429 responses in AOAI APIs


