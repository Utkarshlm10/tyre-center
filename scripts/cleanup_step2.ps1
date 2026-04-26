$file = 'd:\Tyre Center\src\app\page.js'
$lines = Get-Content -Path $file -Encoding UTF8
$keep = $lines[0..1247] + $lines[1568..($lines.Length - 1)]
Set-Content -Path $file -Value $keep -Encoding UTF8
Write-Host "Done. New count: $($keep.Length)"
