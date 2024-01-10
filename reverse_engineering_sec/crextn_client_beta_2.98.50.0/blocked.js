function setInfo() {
    try {
        const date = new Date();
        const now = date.toLocaleDateString('default', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          weekday: 'long',
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          timeZoneName: "short",
          hour12: false,
        });
        
        var site = new URLSearchParams(window.location.search).get('site');
        var category =  new URLSearchParams(window.location.search).get('category');
        var useremail = new URLSearchParams(window.location.search).get('useremail');
        var reason = new URLSearchParams(window.location.search).get('reason');
        category = (reason == 'blockedDomain' ? btoa('Network Misuse') : category);
        // check for null, if null then set empty string instead of null output to browser
        category = category ? category : '';
        site = site ? site : '';
        useremail = useremail ? useremail : '';
        reason = reason ? (reason == 'blockedDomain' ? 'Securly Domain Blocking Detected' : reason) : 'Blocked by Category';
        
        var categoryElem = document.getElementById('category');
        var siteElem = document.getElementById('site');
        var dateElem = document.getElementById('dateTime');
        var userElem = document.getElementById('useremail');
        var reasonElem = document.getElementById('reason');

        categoryElem.innerHTML = atob(category);
        siteElem.innerHTML = atob(site);
        userElem.innerHTML = useremail;
        reasonElem.innerHTML = reason;
        dateElem.innerHTML = now;
    } catch(err) {
        //Do nothing. This is for suppressing javascript errors.
    }
}

 document.addEventListener('DOMContentLoaded', function(event) {
      setInfo();
  });

  $(document).ready(function () {
    $('#show-more').on('click', function (e) {
        e.preventDefault();
        $('.details').show();
        $('.more-details').slideDown();
        $('#show-less').show();
        $(this).hide();
        $(this).attr('aria-expanded', 'true');
    });

    $('#show-less').on('click', function (e) {
        e.preventDefault();
        $('.more-details').slideUp();
        $('.details').hide();
        $('#show-more').show();
        $('#show-more').css('display', 'inline-block');
        $(this).hide();
        $(this).attr('aria-expanded', 'false');
    });
  });