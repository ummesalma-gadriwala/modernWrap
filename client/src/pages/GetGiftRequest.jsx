import React, { Component } from 'react'
import api from '../api'

class GetGiftRequest extends Component {
    constructor(props) {
        super(props)
        this.state = {
            giftRequest: [],
            columns: [],
            isLoading: false
        }
    }

    componentDidMount = async(id) => {
        this.setState({
            isLoading: true
        })

        await api.getGiftRequest(id)
        .then(giftRequest => {
            this.setState({
                giftRequest: giftRequest,
                isLoading: false
            })
        })
    }


    render() {
        const { giftRequest, isLoading } = this.state
        console.log('GetGiftRequest', giftRequest)
        return (
            <div>
                <p>
                    View gift request here
                    {giftRequest}
                </p>
            </div>
        )
    }
}

export default GetGiftRequest