<script>
window.onload = () => {
    // Retrieve the certificate ID from localStorage
    const certificateId = localStorage.getItem('searchedCertificateId');
    const certificates = JSON.parse(localStorage.getItem('certificates')) || [];

    if (!certificateId) {
        alert("No certificate ID found. Please try again.");
        window.location.href = 'front.html';
        return;
    }

    // Find the certificate with the matching ID
    const certificate = certificates.find(cert => cert.certificateid === certificateId);

    if (certificate) {
        // Populate the certificate details in HTML elements
        document.getElementById("cname").textContent = certificate.candidatename;
        document.getElementById("course").textContent = certificate.coursename;
        document.getElementById("grade").textContent = certificate.grade;
        document.getElementById("date").textContent = certificate.issuedate;
    } else {
        alert("Certificate not found.");
        window.location.href = '/notfound.html';
    }
};
</script>
[09:43, 04/11/2024] Gadha Krishna🤗💫: <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>front</title>
<script src="https://cdn.tailwindcss.com"></script>

<script>
    function handleSearch(event) {
        event.preventDefault(); 
        const certificateId = document.getElementById('certificateid').value;

        if (certificateId) {
            // Save the certificate ID to localStorage
            localStorage.setItem('searchedCertificateId', certificateId);
            
            // Redirect to viewcertificate.html
            window.location.href = "/viewcertificate.html";
        } else {
            alert("Please enter a certificate ID.");
        }
    }
</script>

</head>
<body  class="bg-gray-200">


<div class="flex justify-end  p-2 ">
    <a class="bg-sky-500 rounded w-24 h-10 p-2 pl-6 mr-4 text-justify text-slate-100"  href="frontpage.html" >Home</a>
    <a href="issue.html" class="rounded w-40 h-10 p-2 pl-6 text-justify ">Issue certificate</a>
</div>
 

    <div class="text-center text-4xl font-extrabold">
        <p>Certificate Dapp</p>
    </div>
    <div class=" ">
        <div class=" flex justify-center items-center mt-12 " >
            <img class="w-40 h-40" src="online-course.png" alt="" >
        </div>
    </div>

    <div class="flex justify-center items-center  mt-12 ">

        <input class="border border-sky-500" type="text" id="certificateid" placeholder=" enter certificate ID to View">
        <!-- <input class="border border-sky-500 bg-sky-500 w-24 text-slate-100 ml-4" type="button" name="" value="search"> -->
        <button class="border border-sky-500 bg-sky-500 w-24 text-slate-100 ml-4" onclick="handleSearch(event)"  type="submit">search</button>
    </div>


</body>
</html>
