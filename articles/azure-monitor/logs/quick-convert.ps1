$output = @()
foreach ($l in $t)
{
    $ip1 = $l.substring(0,$l.indexof(" "))
    $ip2 = "0.0." + $ip1.split(".")[2] + "." + $ip1.split(".")[3]

    $line = $l.replace($ip1,$ip2)
    $output += $line
}


$l.indexof(".")