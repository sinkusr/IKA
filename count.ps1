$c = Get-Content app.js -Raw
$o = [regex]::Matches($c, '\{').Count
$cl = [regex]::Matches($c, '\}').Count
$po = [regex]::Matches($c, '\(').Count
$pcl = [regex]::Matches($c, '\)').Count
Write-Host "Curly Open: $o, Close: $cl"
Write-Host "Parens Open: $po, Close: $pcl"
