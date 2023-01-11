import React, { useState, useEffect } from 'react'
import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context'

const Home = () =>
{
    const [isLoading, setisLoading] = useState(false);
    const [campaigns, setCampaigns] = useState([]);
    const { address, contract, getCampaigns } = useStateContext();

    const fetchCampaigns = async () =>
    {
        setisLoading(true)
        const data = await getCampaigns();
        setCampaigns(data);
        setisLoading(false)
    }

    useEffect(() =>
    {
        if (contract) fetchCampaigns();

    }, [address, contract]);
    return (
        <DisplayCampaigns
            title="All Campaigns"
            isLoading={ isLoading }
            campaigns={ campaigns }
        />
    )
}

export default Home