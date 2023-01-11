import React, { useContext, createContext } from "react";

import
{
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";

const StateContext = createContext();

export const StateContextProvider = ({ children }) =>
{
  const { contract } = useContract(
    "0x2A68a897FFE57d20951226CEC1832B53882A39B3"
  );
  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    "createCampaign"
  );

  const address = useAddress();
  const connect = useMetamask();

  const publishCampaign = async (form) =>
  {
    try
    {
      const data = await createCampaign([
        address,
        form.title,
        form.description,
        form.target,
        new Date(form.deadline).getTime(),
        form.image,
      ]);
      console.log("Contract call success", data);
    } catch (error)
    {
      console.log("Contract call fail", error);
    }
  };

  const getCampaigns = async () =>
  {
    const campaigns = await contract.call('getCampaigns')
    const parsedCampaigns = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected),
      deadline: campaign.deadline.toNumber(),
      image: campaign.image,
      pId: i,
    }))
    return parsedCampaigns
  }

  const getUserCampaigns = async () =>
  {
    const allCampaigns = await getCampaigns()

    const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address)

    return filteredCampaigns
  }

  const donate = async (pId, amount) =>
  {
    const data = await contract.call('donateToCampaign', pId, { value: ethers.utils.parseEther(amount) })

    return data
  }

  const getDonations = async (pId) =>
  {
    const donation = await contract.call('getDonators', pId)
    const numberOfDonations = donation[0].length
    const parsedDonations = []

    for (let i = 0; i < numberOfDonations; i++)
    {
      parsedDonations.push({
        donator: donation[0][i],
        donation: ethers.utils.formatEther(donation[1][i].toString()),
      })
    }

    return parsedDonations
  }

  return (
    <StateContext.Provider
      value={ { address, contract, connect, createCampaign: publishCampaign, getCampaigns, getUserCampaigns, donate, getDonations } }
    >
      { children }
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
