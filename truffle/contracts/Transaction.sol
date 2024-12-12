// Transaction.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Transaction {
    event TransactionRecord(
        string NumSiret,
        string Weight,
        string deliveryNote
    );

    function myFonctionContrat(
        string memory NumSiret,
        string memory Weight,
        string memory deliveryNote
    ) external {
        // Vous pouvez ajouter ici la logique spécifique à votre fonction
        // (par exemple, stocker les détails de la transaction dans une structure de données)

        // Émettre un événement pour enregistrer la transaction
        emit TransactionRecord(
            NumSiret,
            Weight,
            deliveryNote
        );
    }
}
