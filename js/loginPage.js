
$(document).ready((event) => {
    $('#btn-submit').click((event) => {
        event.preventDefault()

        const name = $('#name').val()
        const password = $('#password').val()
        const urlString = `http://${serverName}:${serverPort}/users/login`

        //send request
        $.ajax({
            url: urlString,
            type: 'POST',
            data: { name, password },
            success: (response) => {
                alert(JSON.stringify(response))
            },
            error: (error) => {
                console.error(error)
            }
        })
    })

})