| Resource | Default limit | Note |
| --- | --- | --- |
| Application Gateway |50 per subscription | Maximum 1000 |
| Frontend IP Configurations |2 |1 public and 1 private |
| Frontend Ports |20 | |
| Backend Address Pools |20 | |
| Backend Servers per pool |100 | |
| HTTP Listeners |20 | |
| HTTP load balancing rules |200 |# of HTTP Listeners * n, n=10 Default |
| Backend HTTP settings |20 |1 per Backend Address Pool |
| Instances per gateway |10 | For more instances, open support ticket |
| SSL certificates |20 |1 per HTTP Listeners |
| Authentication certificates |5 | Maximum 10 |
| Request time out min |1 second | |
| Request time out max |24 hrs | |
| Number of sites |20 |1 per HTTP Listeners |
| URL Maps per listener |1 | |
| Concurrent WebSocket Connections |5000| |
|Maximum URL length|8000|
| Maximum file upload size Standard |2 GB | |
| Maximum file upload size WAF |Medium WAF Gateways - 100 MB<br>Large WAF Gateways - 500 MB| |
|WAF body size limit (without files)|128 KB|

