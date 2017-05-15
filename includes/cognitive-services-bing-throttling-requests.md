The service and your subscription type determines the number of requests that you may make per second (QPS) or per month (QPM). You should ensure that your application includes the logic necessary to stay within your quota. If you exceed your QPM, the request fails with HTTP status code 403. If you exceed your QPS, the request fails with HTTP status code 429. The response also includes the Retry-After header, which contains the number of seconds that you should wait before sending another request.  
  
### Denial of Service (DOS) versus Throttling

The service differentiates between a DOS attack and QPS violation. If the service suspects a denial of service attack, the request succeeds (HTTP status code is 200 OK); however, the body of the response is empty.