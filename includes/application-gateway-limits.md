| Resource | Default limit | Note |
| --- | --- | --- |
| Application Gateway |50 per subscription | |
| Frontend IP Configurations |2 |1 public and 1 private |
| Frontend Ports |20 | |
| Backend Address Pools |20 | |
| Backend Servers per pool |100 | |
| HTTP Listeners |20 | |
| HTTP load balancing rules |200 |# of HTTP Listeners * n, n=10 Default |
| Backend HTTP settings |20 |1 per Backend Address Pool |
| Instances per gateway |10 | |
| SSL certificates |20 |1 per HTTP Listeners |
| Authentication certificates |5 | Maximum 10 |
| Request timeout min |1 second | |
| Request timeout max |24hrs | |
| Number of sites |20 |1 per HTTP Listeners |
| URL Maps per listener |1 | |

