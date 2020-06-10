
$(document).ready((event) => {
    $('#btn-submit').click((event) => {
        event.preventDefault()

        const name = $('#name').val()
        const weight = parseFloat($('#weight').val())
        const height = parseFloat($('#height').val())
        const urlString = `http://${serverName}:${serverPort}/users/bmi?name=${name}&weight=${weight}&height=${height}`

        //send request
        $.ajax({
            url: urlString,
            type: 'GET',
            success: (response) => {
                $('#bmi-value').val(response.data)
            },
            error: (error) => {
                console.error(error)
            }
        })
    })

})